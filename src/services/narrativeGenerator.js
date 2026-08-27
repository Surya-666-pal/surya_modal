/**
 * Narrative Generator Service for Bharat Yatra AI Trip Planner (Step 9)
 * Generates 2-3 sentence evocative cultural backstories, local folklore,
 * and secret tips for each stop, matching the "Hidden Gems" storytelling tone.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODELS = ["gemini-3.6-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

/**
 * Step 9: Generate narrative storytelling descriptions for places across all days
 * @param {string} destination - Trip city/region
 * @param {Array} daysList - Array of day objects with stops
 * @param {Array} vibes - Selected travel vibes
 * @returns {Promise<Array>} Enriched daysList with narrative stories
 */
export async function generateItineraryNarratives(destination, daysList = [], vibes = []) {
  if (!daysList || daysList.length === 0) return daysList;

  // If offline, return immediately with existing descriptions
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return daysList;
  }

  // Extract all place names for batch narrative generation
  const placesQueryList = [];
  daysList.forEach((d) => {
    (d.stops || []).forEach(s => {
      placesQueryList.push({ day: d.day, name: s.name, category: s.category || s.vibeId });
    });
  });

  if (placesQueryList.length === 0) return daysList;

  const prompt = `You are the master storyteller and heritage historian for "Bharat Yatra — Hidden Gems of India".
Destination: ${destination}
Selected Vibes: ${vibes.join(', ') || 'Heritage, Spirituality, Food'}

For each of the following places, write a 2-sentence evocative cultural narrative (folklore, secret local legend, architectural wonder, or culinary mystery).
Tone: Atmospheric, immersive, poetic yet informative, authentic Indian storytelling.

Places list:
${placesQueryList.map((p, idx) => `${idx + 1}. [Day ${p.day}] ${p.name} (${p.category})`).join('\n')}

Return ONLY a valid JSON object mapping place names (or exact place index string "1", "2", etc.) to their 2-sentence narrative story:
{
  "1": "Evocative 2-sentence narrative for place 1...",
  "2": "Evocative 2-sentence narrative for place 2..."
}`;

  try {
    for (const model of MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const payload = {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            responseMimeType: "application/json"
          }
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000);
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) continue;

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) continue;

        let cleaned = text.trim();
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
        }

        const parsed = JSON.parse(cleaned);
        
        // Merge narratives into stops
        let placeIdx = 1;
        const enrichedDays = daysList.map(day => {
          const enrichedStops = (day.stops || []).map(stop => {
            const story = parsed[String(placeIdx)] || parsed[stop.name] || stop.description;
            placeIdx++;
            return {
              ...stop,
              narrative: story,
              description: story || stop.description
            };
          });
          return {
            ...day,
            stops: enrichedStops
          };
        });

        console.log(`[NarrativeGenerator] ✨ Generated folklore storytelling for ${placesQueryList.length} places.`);
        return enrichedDays;

      } catch (err) {
        console.warn(`[NarrativeGenerator] Gemini ${model} failed, trying next:`, err.message);
      }
    }
  } catch (error) {
    console.error("[NarrativeGenerator] Narrative generation fallback triggered:", error);
  }

  // Graceful fallback: return original daysList with default descriptions
  return daysList;
}
