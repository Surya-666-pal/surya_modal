/**
 * Google Places & Gemini-Powered Places Discovery Service for Bharat Yatra
 * Features strict client-side type-safety filtering, error code diagnostics,
 * multi-select Promise.all merging, and console telemetry.
 */

import { VIBE_MAPPING, CURATED_FALLBACK_GEMS, resolveLocationBias } from './vibeMapping';

const GOOGLE_PLACES_KEY = import.meta.env.VITE_GOOGLE_PLACES_KEY || '';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'REMOVED_SECRET';
const MODELS = ['gemini-3.6-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

// In-memory session cache: Map<"vibeId:city", normalised results[]>
const sessionCache = new Map();

/**
 * 4. Strict Client-Side Type Matching & Safety Net Filter
 * FIXED: More lenient matching - only block on forbidden types,
 * then accept if any keyword loosely matches name/description OR types overlap.
 */
export function validatePlaceForVibe(place, vibeId) {
  const vibe = VIBE_MAPPING[vibeId];
  if (!vibe) return false;

  const placeTypes = (place.types || []).map(t => t.toLowerCase());
  const placeName = (place.name || place.displayName?.text || '').toLowerCase();
  const placeDesc = (place.description || place.editorialSummary?.text || '').toLowerCase();
  const fullText = `${placeName} ${placeDesc}`;

  // 1. Strict Exclusion: reject if forbidden type is present
  if (vibe.forbiddenTypes && vibe.forbiddenTypes.length > 0) {
    const hasForbiddenType = placeTypes.some(t => vibe.forbiddenTypes.includes(t));
    if (hasForbiddenType) {
      console.log(`[PlacesService] 🛑 Rejected "${place.name}": forbidden type (${placeTypes.join(', ')}) for "${vibe.label}"`);
      return false;
    }
  }

  // 2. Inclusion - accept if ANY of these conditions are true:
  //    a) Types overlap with allowedTypes
  //    b) Name/description matches any matchKeyword
  //    c) Types contains the vibe's primary type string (or partial match)
  const hasAllowedType = vibe.allowedTypes && vibe.allowedTypes.some(t => placeTypes.includes(t));
  const hasKeywordMatch = vibe.matchKeywords && vibe.matchKeywords.some(kw => fullText.includes(kw.toLowerCase()));
  
  // Extra lenient match: check if any type string partially overlaps (e.g. "tourist_attraction" in types)
  const hasPrimaryType = placeTypes.some(t =>
    t.includes('tourist') || t.includes('attraction') || t.includes('landmark') ||
    t.includes('park') || t.includes('natural') || t.includes('religious') ||
    t.includes('temple') || t.includes('restaurant') || t.includes('food') ||
    t.includes('museum') || t.includes('historic')
  );

  if (!hasAllowedType && !hasKeywordMatch) {
    // For Gemini-sourced results (no Google types), be lenient - just skip forbidden check
    if (placeTypes.length === 0 || (placeTypes.length === 1 && placeTypes[0] === vibe.type)) {
      return true; // Trust Gemini's vibe-scoped search
    }
    // Has types but none match - reject
    if (placeTypes.length > 0 && !hasPrimaryType) {
      console.log(`[PlacesService] ⚠️ Filtered "${place.name}": no type/keyword match for "${vibe.label}"`);
      return false;
    }
  }

  return true;
}

/**
 * Normalise a Google Places Text Search result into the standard gem shape
 */
function normaliseGooglePlaceResult(place, vibeId, cityOrRegion) {
  const vibe = VIBE_MAPPING[vibeId];
  const placeId = place.place_id || place.id || `gp_${Math.random().toString(36).slice(2, 9)}`;
  
  let imageUrl = 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=1000&auto=format&fit=crop';
  if (place.photos && place.photos.length > 0) {
    const photoRef = place.photos[0].photo_reference || place.photos[0].name;
    if (photoRef) {
      if (place.photos[0].name) {
        imageUrl = `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxHeightPx=600&maxWidthPx=800&key=${GOOGLE_PLACES_KEY}`;
      } else {
        imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${GOOGLE_PLACES_KEY}`;
      }
    }
  }

  const rating = typeof place.rating === 'number' ? place.rating : 4.85;
  const userRatings = place.user_ratings_total || place.userRatingCount || 150;
  const crowdLevel = userRatings > 5000 ? 'Popular' : userRatings > 1000 ? 'Moderate' : 'Hidden Gem';
  
  const address = place.formatted_address || place.formattedAddress || `${cityOrRegion}, India`;
  const statePart = address.split(',').slice(-2, -1)[0]?.trim() || cityOrRegion || 'India';
  const name = place.name || place.displayName?.text || 'Historical Landmark';

  return {
    id: placeId,
    place_id: placeId,
    name,
    state: statePart,
    category: vibe?.label || 'Heritage & Culture',
    image: imageUrl,
    crowdLevel,
    rating,
    description: place.editorialSummary?.text || place.editorial_summary?.overview || `${name} is an authentic ${vibe?.label?.toLowerCase() || 'travel'} landmark located in ${cityOrRegion}.`,
    lat: place.geometry?.location?.lat || place.location?.latitude || null,
    lng: place.geometry?.location?.lng || place.location?.longitude || null,
    types: place.types || [vibe.type],
    vibes: [vibeId],
    source: 'google_places'
  };
}

/**
 * Call Gemini AI for strict vibe-specific place discovery
 * FIXED: Better prompt with city context + more lenient result parsing
 */
async function callGeminiForVibePlaces(vibe, cityOrRegion) {
  const cityContext = cityOrRegion && cityOrRegion !== 'India'
    ? `specifically in or near ${cityOrRegion}, India`
    : `across India (choose the most iconic and authentic destinations)`;

  const prompt = `You are an expert India travel guide. List exactly 6 real, well-known "${vibe.label}" destinations ${cityContext}.

Strictly only include places that are genuinely: ${vibe.keywords.join(', ')}.
Do NOT include: any ${(vibe.forbiddenTypes || []).join(', ')} type places.

Respond ONLY with a valid JSON array. Each object must have:
- "name": string (real, specific place name)
- "state": string (Indian state name)
- "crowdLevel": one of "Hidden Gem", "Peaceful", "Moderate", "Vibrant", "Serene"
- "rating": number between 4.5 and 4.98
- "description": 2-sentence authentic cultural description
- "lat": number (accurate GPS latitude for India)
- "lng": number (accurate GPS longitude for India)
- "types": array like ["${vibe.type}"]

Return ONLY the JSON array, no markdown, no extra text.`;

  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const payload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json'
        }
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!res.ok) {
        console.warn(`[PlacesService] Gemini ${model} HTTP ${res.status}`);
        continue;
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) continue;

      let cleaned = text.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
      }
      // Strip any text before '[' and after last ']'
      const startIdx = cleaned.indexOf('[');
      const endIdx = cleaned.lastIndexOf(']');
      if (startIdx !== -1 && endIdx !== -1) {
        cleaned = cleaned.slice(startIdx, endIdx + 1);
      }

      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log(`[PlacesService] ✅ Gemini ${model} returned ${parsed.length} results for "${vibe.label}" in "${cityOrRegion}"`);
        return parsed;
      }
    } catch (err) {
      console.warn(`[PlacesService] Gemini ${model} failed for "${vibe.id}":`, err.message);
    }
  }
  return null;
}

/**
 * Fetch from Google Places API Text Search with location bias & type filtering
 */
async function fetchGooglePlacesTextSearch(vibe, bias, cityOrRegion) {
  const query = `${vibe.keywords.join(' OR ')} in ${cityOrRegion}`;
  const endpoint = 'https://places.googleapis.com/v1/places:searchText';

  const requestBody = {
    textQuery: query,
    includedType: vibe.type,
    languageCode: 'en',
    maxResultCount: 10,
    locationBias: {
      circle: {
        center: { latitude: bias.lat, longitude: bias.lng },
        radius: bias.radius
      }
    }
  };

  console.log(`[PlacesService] 🚀 Google Places API Request for "${vibe.id}":`, {
    url: endpoint,
    vibeId: vibe.id,
    type: vibe.type,
    keywords: vibe.keywords,
    cityOrRegion,
    locationBias: { lat: bias.lat, lng: bias.lng, radiusMeters: bias.radius }
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_PLACES_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.photos,places.editorialSummary,places.location,places.types'
    },
    body: JSON.stringify(requestBody),
    signal: controller.signal
  });
  clearTimeout(timeout);

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    if (res.status === 403 || errorText.includes('REQUEST_DENIED') || errorText.includes('API_KEY_INVALID')) {
      console.error(`[PlacesService] ❌ REQUEST_DENIED (HTTP ${res.status}). Check API key billing/permissions.`);
    } else if (res.status === 429 || errorText.includes('OVER_QUERY_LIMIT')) {
      console.error(`[PlacesService] ❌ OVER_QUERY_LIMIT (HTTP ${res.status}). Quota exceeded.`);
    } else {
      console.error(`[PlacesService] ❌ Google Places API Error: HTTP ${res.status}`, errorText);
    }
    throw new Error(`Google Places API returned status ${res.status}`);
  }

  const data = await res.json();
  const places = data.places || [];

  if (places.length === 0) {
    console.warn(`[PlacesService] ⚠️ ZERO_RESULTS for "${vibe.id}" in "${cityOrRegion}".`);
  } else {
    console.log(`[PlacesService] 📥 Google Places: ${places.length} raw results for "${vibe.id}".`);
  }

  return places;
}

/**
 * Search places scoped to the selected vibe and city/region
 * FIXED: Better fallback chain, corrected safety net for Gemini results
 */
export async function searchPlacesByVibe(vibeId, cityOrRegion = 'India') {
  const cacheKey = `${vibeId}:${(cityOrRegion || 'India').toLowerCase().trim()}`;

  if (sessionCache.has(cacheKey)) {
    const cached = sessionCache.get(cacheKey);
    console.log(`[PlacesService] ⚡ Cache HIT [${cacheKey}] (${cached.length} places)`);
    return cached;
  }

  const vibe = VIBE_MAPPING[vibeId];
  if (!vibe) {
    console.warn(`[PlacesService] ⚠️ Unknown vibe key: "${vibeId}"`);
    return [];
  }

  const bias = resolveLocationBias(cityOrRegion);
  console.log(`[PlacesService] 📍 Location bias resolved for "${cityOrRegion}":`, { lat: bias.lat, lng: bias.lng, radiusMeters: bias.radius });

  // Attempt 1: Google Places API (only if properly configured)
  const isGoogleKeyConfigured = GOOGLE_PLACES_KEY &&
    GOOGLE_PLACES_KEY.length > 20 &&
    !GOOGLE_PLACES_KEY.startsWith('your_') &&
    !GOOGLE_PLACES_KEY.startsWith('AQ.');

  if (isGoogleKeyConfigured) {
    try {
      const rawPlaces = await fetchGooglePlacesTextSearch(vibe, bias, cityOrRegion);
      const validatedPlaces = rawPlaces
        .map(p => normaliseGooglePlaceResult(p, vibeId, cityOrRegion))
        .filter(p => validatePlaceForVibe(p, vibeId));

      if (validatedPlaces.length > 0) {
        console.log(`[PlacesService] 🛡️ Google Places: ${validatedPlaces.length} validated places for "${vibe.label}"`);
        sessionCache.set(cacheKey, validatedPlaces);
        return validatedPlaces;
      }
    } catch (err) {
      console.warn(`[PlacesService] Google Places fetch failed for "${vibe.id}":`, err.message);
    }
  }

  // Attempt 2: Gemini AI targeted vibe+city search
  if (GEMINI_API_KEY && GEMINI_API_KEY.length > 10) {
    try {
      console.log(`[PlacesService] 🤖 Calling Gemini AI for "${vibe.label}" in "${cityOrRegion}"...`);
      const aiPlaces = await callGeminiForVibePlaces(vibe, cityOrRegion);

      if (aiPlaces && aiPlaces.length > 0) {
        const fallbacks = CURATED_FALLBACK_GEMS[vibeId] || [];
        const mappedAiPlaces = aiPlaces.map((p, idx) => ({
          id: `gem_${vibeId}_${idx}_${Date.now()}`,
          place_id: `gem_${vibeId}_${idx}_${String(p.name).toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          name: p.name,
          state: p.state || cityOrRegion || 'India',
          category: vibe.label,
          image: fallbacks[idx % fallbacks.length]?.image || 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=1000&auto=format&fit=crop',
          crowdLevel: p.crowdLevel || 'Hidden Gem',
          rating: typeof p.rating === 'number' ? Math.min(5, Math.max(4.0, p.rating)) : 4.88,
          description: p.description || `${p.name} is a premier ${vibe.label.toLowerCase()} destination in ${cityOrRegion}.`,
          lat: typeof p.lat === 'number' ? p.lat : bias.lat,
          lng: typeof p.lng === 'number' ? p.lng : bias.lng,
          types: Array.isArray(p.types) && p.types.length > 0 ? p.types : [vibe.type],
          vibes: [vibeId],
          source: 'gemini'
        }));

        // Apply safety net — but lenient for Gemini results since they were vibe-scoped in prompt
        const validatedAiPlaces = mappedAiPlaces.filter(p => validatePlaceForVibe(p, vibeId));

        if (validatedAiPlaces.length > 0) {
          console.log(`[PlacesService] 🤖 Gemini: ${validatedAiPlaces.length} verified spots for "${vibe.label}" in "${cityOrRegion}"`);
          sessionCache.set(cacheKey, validatedAiPlaces);
          return validatedAiPlaces;
        }

        // If ALL were filtered out (over-strict), return mapped without safety net as last resort
        if (mappedAiPlaces.length > 0) {
          console.warn(`[PlacesService] ⚠️ Safety net too strict — returning ${mappedAiPlaces.length} Gemini results unfiltered for "${vibe.label}"`);
          sessionCache.set(cacheKey, mappedAiPlaces);
          return mappedAiPlaces;
        }
      }
    } catch (gErr) {
      console.warn(`[PlacesService] Gemini vibe search failed for "${vibe.id}":`, gErr.message);
    }
  }

  // Attempt 3: Pure Curated Fallback (always returns results)
  console.log(`[PlacesService] 📦 Using curated fallback for "${vibe.label}" (${CURATED_FALLBACK_GEMS[vibeId]?.length || 0} spots)`);
  const curated = CURATED_FALLBACK_GEMS[vibeId] || [];
  sessionCache.set(cacheKey, curated);
  return curated;
}

/**
 * Multi-Select Filtering: Independent queries per vibe, merged by place_id
 */
export async function searchMultipleVibes(vibeIds = [], cityOrRegion = 'India') {
  if (!vibeIds || vibeIds.length === 0) {
    console.log('[PlacesService] ℹ️ No vibes active. Returning empty set.');
    return [];
  }

  const city = cityOrRegion || 'India';
  console.log(`[PlacesService] 🔄 Parallel search for [${vibeIds.join(', ')}] in "${city}"...`);

  const vibeResultArrays = await Promise.all(
    vibeIds.map(vibeId => searchPlacesByVibe(vibeId, city))
  );

  // Merge and deduplicate
  const seenMap = new Map();

  vibeResultArrays.forEach((vibePlaces, idx) => {
    const currentVibeId = vibeIds[idx];
    const currentVibe = VIBE_MAPPING[currentVibeId];

    (vibePlaces || []).forEach(gem => {
      if (!gem) return;
      const key = (gem.place_id || gem.id || gem.name || '').toLowerCase().trim();
      if (!key) return;

      if (seenMap.has(key)) {
        const existing = seenMap.get(key);
        seenMap.set(key, {
          ...existing,
          vibes: Array.from(new Set([...(existing.vibes || []), currentVibeId]))
        });
      } else {
        seenMap.set(key, {
          ...gem,
          category: currentVibe?.label || gem.category,
          vibes: gem.vibes && gem.vibes.length > 0 ? gem.vibes : [currentVibeId]
        });
      }
    });
  });

  const finalResults = Array.from(seenMap.values());

  console.log(`%c[PlacesService] 🎯 Final Results: ${finalResults.length} places across ${vibeIds.length} vibes in "${city}"`, 'color: #F0932B; font-weight: bold;');
  console.table(finalResults.map(p => ({
    Name: p.name,
    State: p.state,
    Category: p.category,
    Vibes: (p.vibes || []).join(', '),
    Rating: p.rating,
    Source: p.source || 'curated'
  })));

  return finalResults;
}

/**
 * Clear session cache (call when city changes)
 */
export function clearPlacesCache() {
  sessionCache.clear();
  console.log('[PlacesService] 🧹 Session cache cleared.');
}
