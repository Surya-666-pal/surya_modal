/**
 * Places Fetcher Service for Bharat Yatra AI Trip Planner (Step 6)
 * Queries candidate locations for start_city matching stated interests using VIBE_MAPPING.
 * Fetches enough candidates (~3-4 per day) and tags each candidate with GPS coordinates and vibe.
 */

import { searchPlacesByVibe } from './placesService';
import { VIBE_MAPPING } from './vibeMapping';
import { extractPlaceInfo } from './routeOptimizer';

/**
 * Fetch candidate places for a trip based on city, interests, and duration
 * @param {object} params - { start_city, interests, days }
 * @returns {Promise<Array>} Array of candidate place objects
 */
export async function fetchCandidatePlaces({ start_city, interests = [], days = 3 }) {
  const city = start_city || "Varanasi";
  const activeVibes = (interests && interests.length > 0) 
    ? interests 
    : ["heritage_forts", "spiritual_ghats", "street_food"];

  const targetCount = Math.max(8, days * 4);
  console.log(`[PlacesFetcher] 🔎 Fetching ~${targetCount} candidate places for "${city}" across vibes: [${activeVibes.join(', ')}]...`);

  // Fetch candidates across all selected vibes in parallel
  const vibePromises = activeVibes.map(vibeId => searchPlacesByVibe(vibeId, city));
  const rawResults = await Promise.all(vibePromises);

  // Deduplicate and tag places
  const placeMap = new Map();

  rawResults.forEach((placesList, vIdx) => {
    const vibeId = activeVibes[vIdx];
    const vibeDef = VIBE_MAPPING[vibeId];

    placesList.forEach((place, pIdx) => {
      if (!place || !place.name) return;
      const key = (place.place_id || place.id || place.name).toLowerCase().trim();

      // Ensure coordinate resolution
      let lat = place.lat;
      let lng = place.lng;
      if (!lat || !lng) {
        const extracted = extractPlaceInfo(place.name, city, pIdx);
        lat = extracted.lat;
        lng = extracted.lng;
      }

      if (!placeMap.has(key)) {
        placeMap.set(key, {
          id: place.id || `cand_${vibeId}_${pIdx}_${Date.now()}`,
          place_id: place.place_id || place.id || `cand_${key}`,
          name: place.name,
          state: place.state || city,
          category: vibeDef?.label || place.category || "Cultural Landmark",
          vibeId,
          image: place.image || "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=1000&auto=format&fit=crop",
          rating: place.rating || 4.85,
          crowdLevel: place.crowdLevel || "Hidden Gem",
          description: place.description || `${place.name} is an iconic destination in ${city}.`,
          lat,
          lng,
          openTime: place.openTime || "06:00",
          closeTime: place.closeTime || "21:00"
        });
      }
    });
  });

  const candidates = Array.from(placeMap.values());
  console.log(`[PlacesFetcher] ✅ Retrieved ${candidates.length} unique candidate places for ${city}`);

  if (candidates.length === 0) {
    throw new Error(`NO_PLACES_FOUND_FOR_${city.toUpperCase()}`);
  }

  return candidates;
}
