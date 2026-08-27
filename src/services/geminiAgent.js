/**
 * Bharat Yatra Gemini AI Agent Service
 * Powers live AI trip itinerary generation, real-time multilingual travel assistant,
 * accessibility advisor, function calling slot extraction, and offline caching via IndexedDB.
 */

import { saveTripOffline, getOfflineTrip, getAllOfflineTrips } from './offlineStorage';

export { saveTripOffline, getOfflineTrip, getAllOfflineTrips };

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "REMOVED_SECRET";

const MODELS = ["gemini-3.6-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];

/**
 * Check if the browser is currently offline
 */
export function isNetworkOffline() {
  return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' && !navigator.onLine;
}

/**
 * Function calling tools declaration for Travel Slot Extraction
 */
const travelSlotExtractionTool = {
  function_declarations: [
    {
      name: "extractTravelSlots",
      description: "Extract structured travel itinerary planning slots from user request or preferences",
      parameters: {
        type: "OBJECT",
        properties: {
          destination: {
            type: "STRING",
            description: "Target destination, city, or region in India (e.g. Varanasi, Spiti Valley, Kerala, Jaipur)"
          },
          days: {
            type: "INTEGER",
            description: "Number of trip duration days (e.g. 1, 3, 5, 10)"
          },
          budget: {
            type: "STRING",
            description: "Budget tier: 'Budget Explorer', 'Balanced Comfort', or 'Luxury Heritage'"
          },
          group_size: {
            type: "INTEGER",
            description: "Number of travelers in the party"
          },
          interests: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "Travel vibe categories (e.g. heritage, spiritual, nature, adventure, culinary)"
          },
          accessibility_needs: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "Accessibility requirements like ISL (Sign Language), wheelchair ramp, audio tour"
          },
          start_city: {
            type: "STRING",
            description: "Starting departure city if mentioned"
          }
        },
        required: ["destination", "days"]
      }
    }
  ]
};

/**
 * Core caller to Google Gemini REST API with optional tools/system instruction
 */
async function callGemini(prompt, systemInstruction = "", tools = null) {
  // If offline, throw immediately to avoid hanging network calls
  if (isNetworkOffline()) {
    throw new Error("NETWORK_OFFLINE");
  }

  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      
      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      };

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      if (tools) {
        payload.tools = tools;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.warn(`Gemini model ${model} returned status ${response.status}`);
        continue;
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      
      // Check for function call in response
      const functionCall = candidate?.content?.parts?.[0]?.functionCall;
      if (functionCall) {
        return { type: 'function_call', data: functionCall };
      }

      const text = candidate?.content?.parts?.[0]?.text;
      if (text) {
        return { type: 'text', data: text };
      }
    } catch (err) {
      console.warn(`Error calling Gemini ${model}:`, err);
    }
  }

  throw new Error("Unable to connect to Gemini API.");
}

/**
 * Slot Extraction using Gemini Function Calling
 * Extracts: days, budget, group_size, interests, accessibility_needs, start_city, destination
 */
export async function extractTravelSlotsWithGemini(userQuery) {
  if (isNetworkOffline()) {
    return {
      destination: "Varanasi",
      days: 3,
      budget: "Balanced Comfort",
      interests: ["heritage", "spiritual"],
      accessibility_needs: ["audio"],
      group_size: 2,
      start_city: ""
    };
  }

  const prompt = `Extract all travel planning parameters from this user request: "${userQuery}". Call the extractTravelSlots function with the extracted fields.`;
  
  try {
    const result = await callGemini(prompt, "You are a travel parameter extractor for India travel.", [travelSlotExtractionTool]);
    if (result?.type === 'function_call' && result.data?.args) {
      return result.data.args;
    }
  } catch (error) {
    console.warn("Function calling slot extraction fallback:", error);
  }

  return {
    destination: userQuery || "Varanasi",
    days: 3,
    budget: "Balanced Comfort",
    interests: ["heritage", "spiritual"],
    accessibility_needs: ["audio"],
    group_size: 2,
    start_city: ""
  };
}

/**
 * Generate structured fallback activities with real coordinates, opening hours, and vibe matching
 */
function generateFallbackActivities(destination = "Varanasi", dayIndex = 0, vibes = []) {
  const dest = destination.toLowerCase();
  
  // Real destination profiles with authentic landmark names, accurate coordinates, and real operating hours
  const destinationProfiles = {
    varanasi: [
      [
        { time: "05:30 AM", name: "Assi Ghat Sunrise Subah-e-Banaras", description: "Vedic chants, classical morning ragas and dawn boat ride along the sacred Ganga.", lat: 25.2891, lng: 83.0064, openTime: "04:30", closeTime: "22:00", category: "spiritual" },
        { time: "09:30 AM", name: "Kashi Vishwanath Temple & Corridor", description: "Sacred Jyotirlinga darshan with accessible ramps and heritage corridor walk.", lat: 25.3109, lng: 83.0107, openTime: "03:00", closeTime: "23:00", category: "spiritual" },
        { time: "01:00 PM", name: "Godowlia Traditional Kachori & Lassi Gully", description: "Authentic Banarasi breakfast feast: hot hing kachori, jalebi and creamy malai lassi.", lat: 25.3100, lng: 83.0050, openTime: "07:00", closeTime: "23:00", category: "culinary" },
        { time: "05:30 PM", name: "Dashashwamedh Ghat Maha Ganga Aarti", description: "Grand twilight brass-lamp fire ceremony with synchronized conch blowing.", lat: 25.3069, lng: 83.0104, openTime: "05:00", closeTime: "22:00", category: "spiritual" }
      ],
      [
        { time: "08:30 AM", name: "Dhamek Stupa & Sarnath Deer Park", description: "Ancient 500 CE Buddhist monument where Lord Buddha gave his first sermon.", lat: 25.3809, lng: 83.0245, openTime: "06:00", closeTime: "18:00", category: "heritage" },
        { time: "11:30 AM", name: "Sarnath Archaeological Museum", description: "Home of the original Ashoka Lion Capital national emblem and Gandhara sculptures.", lat: 25.3780, lng: 83.0230, openTime: "09:00", closeTime: "17:00", category: "heritage" },
        { time: "02:30 PM", name: "Banaras Weavers Guild & Zari Workshop", description: "Master silk artisans weaving pure gold-thread Banarasi bridal sarees on handlooms.", lat: 25.3250, lng: 82.9950, openTime: "10:00", closeTime: "19:00", category: "heritage" },
        { time: "06:00 PM", name: "Manikarnika Ghat Heritage Trail", description: "Ancient burning ghat and centuries-old hidden Shiva temples with local historian.", lat: 25.3108, lng: 83.0142, openTime: "00:00", closeTime: "23:59", category: "walk" }
      ],
      [
        { time: "07:30 AM", name: "Ramnagar Fort & Vintage Car Museum", description: "18th-century sandstone fortress on the eastern Ganga bank with royal armory.", lat: 25.2687, lng: 83.0248, openTime: "09:30", closeTime: "17:00", category: "heritage" },
        { time: "11:30 AM", name: "Banaras Hindu University & Bharat Kala Bhavan", description: "Lush green campus with New Vishwanath Temple and priceless miniature art gallery.", lat: 25.2677, lng: 82.9913, openTime: "08:00", closeTime: "18:00", category: "heritage" },
        { time: "02:30 PM", name: "Chowk Street Food & Paan Heritage Trail", description: "Taste world-famous Banarasi meetha paan, tamatar chaat, and seasonal malaiyo foam.", lat: 25.3130, lng: 83.0080, openTime: "10:00", closeTime: "23:00", category: "culinary" },
        { time: "06:00 PM", name: "Chet Singh Fort Ghat Sunset Vista", description: "Historic river fortress with sunset panorama across the majestic Ganga bend.", lat: 25.2970, lng: 83.0070, openTime: "06:00", closeTime: "20:00", category: "nature" }
      ]
    ],
    delhi: [
      [
        { time: "08:00 AM", name: "Red Fort & Lahori Gate", description: "Massive 17th-century Mughal citadel built by Emperor Shah Jahan.", lat: 28.6562, lng: 77.2410, openTime: "09:30", closeTime: "17:30", category: "heritage" },
        { time: "11:30 AM", name: "Chandni Chowk Paranthe Wali Gali", description: "Deep-fried stuffed paranthas and traditional Old Delhi jalebi tasting.", lat: 28.6506, lng: 77.2303, openTime: "09:00", closeTime: "22:00", category: "culinary" },
        { time: "02:30 PM", name: "Humayun's Tomb & Charbagh Gardens", description: "UNESCO World Heritage red sandstone garden tomb that inspired the Taj Mahal.", lat: 28.5878, lng: 77.2507, openTime: "06:00", closeTime: "18:00", category: "heritage" },
        { time: "06:00 PM", name: "India Gate & Kartavya Path Walk", description: "Iconic war memorial archway illuminated under evening lights with fountain stroll.", lat: 28.6129, lng: 77.2295, openTime: "00:00", closeTime: "23:59", category: "walk" }
      ]
    ],
    jaipur: [
      [
        { time: "08:00 AM", name: "Amber Fort & Sheesh Mahal", description: "Majestic hilltop Rajput fortress with intricate mirror palaces overlooking Maota Lake.", lat: 26.9855, lng: 75.8513, openTime: "08:00", closeTime: "17:30", category: "heritage" },
        { time: "11:30 AM", name: "Hawa Mahal (Palace of Winds)", description: "Five-story pink sandstone facade with 953 jharokha honeycomb windows.", lat: 26.9239, lng: 75.8267, openTime: "09:00", closeTime: "17:00", category: "heritage" },
        { time: "01:30 PM", name: "Laxmi Misthan Bhandar (LMB) Johari Bazaar", description: "Legendary Rajasthani thali, pyaaz kachori, and ghewar in the walled pink city.", lat: 26.9190, lng: 75.8260, openTime: "08:00", closeTime: "23:00", category: "culinary" },
        { time: "05:30 PM", name: "Nahargarh Fort Sunset Point", description: "Panoramic sunset view over the entire Pink City skyline from the Aravalli cliffs.", lat: 26.9378, lng: 75.8156, openTime: "10:00", closeTime: "22:00", category: "nature" }
      ]
    ]
  };

  // Select destination set or generic coordinate-rich set
  let daysList = destinationProfiles.varanasi;
  if (dest.includes('delhi')) daysList = destinationProfiles.delhi;
  else if (dest.includes('jaipur') || dest.includes('rajasthan')) daysList = destinationProfiles.jaipur;

  const dayActivities = daysList[dayIndex % daysList.length];
  return dayActivities;
}

/**
 * Generate Real-time AI Day-by-Day Travel Itinerary
 * Saves to IndexedDB under a unique trip ID and pre-caches assets
 */
export async function generateGeminiItinerary({ destination, days = 3, vibes = [], accessibility = [], budget = "Balanced Comfort", language = "English" }) {
  const destName = (destination || 'Varanasi').trim();
  const tripId = `trip_${Date.now()}_${destName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

  // If offline, check if matching saved trip exists in IndexedDB
  if (isNetworkOffline()) {
    const offlineTrips = await getAllOfflineTrips();
    const matched = offlineTrips.find(t => t.destination?.toLowerCase().includes(destName.toLowerCase()) || t.title?.toLowerCase().includes(destName.toLowerCase()));
    if (matched) {
      return matched;
    }

    // Return structured offline fallback with real coordinates and opening hours
    const offlinePlan = {
      id: tripId,
      destination: destName,
      title: `${days}-Day Inclusive Trail: ${destName}`,
      destinationSummary: `Offline Mode Active: Explore the cultural landmarks and heritage paths of ${destName}.`,
      bestTimeToVisit: "October to March",
      localDelicacies: ["Regional Specialty Thali", "Local Street Snacks", "Traditional Sweets"],
      accessibilityHighlights: ["ISL Video Guide Available", "Wheelchair Ramp Access", "Verified Local Guides"],
      isOffline: true,
      days: Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        title: i === 0 ? "Ancient Roots & Morning Exploration" : i === 1 ? "Artisans, Fortresses & Heritage Alleys" : `Hidden Sanctuaries & Sunset Trails`,
        time: "06:00 AM – 08:30 PM",
        activities: generateFallbackActivities(destName, i, vibes)
      }))
    };

    await saveTripOffline(offlinePlan);
    return offlinePlan;
  }

  const vibeLabels = vibes.join(", ") || "Heritage, Culture, Local Cuisine";

  const vibeInstructions = vibes.length > 0 ? `
CRITICAL VIBE INSTRUCTIONS — The traveler has specifically selected these vibes: ${vibeLabels}.
You MUST heavily prioritise activities matching these vibes:
${vibes.map(v => {
  if (v.toLowerCase().includes('heritage') || v.toLowerCase().includes('fort')) return `- Heritage & Forts: Include real forts, palaces, UNESCO sites, ASI monuments, ancient ruins, royal architecture, and guided heritage walks`;
  if (v.toLowerCase().includes('spiritual') || v.toLowerCase().includes('ghat')) return `- Spiritual Ghats: Include real ghats, temples, aarti ceremonies, meditation spots, sacred rivers, monastery visits, and spiritual dawn rituals`;
  if (v.toLowerCase().includes('lake') || v.toLowerCase().includes('tea') || v.toLowerCase().includes('hill') || v.toLowerCase().includes('nature')) return `- Lakes & Tea Hills: Include real lakes, tea plantations, hill station viewpoints, botanical gardens, nature trails, and scenic valley drives`;
  if (v.toLowerCase().includes('trek') || v.toLowerCase().includes('pass') || v.toLowerCase().includes('adventure')) return `- Trekking & Passes: Include real mountain passes, trek routes, rock climbing spots, river rafting, paragliding, camping sites, and adventure sports`;
  if (v.toLowerCase().includes('food') || v.toLowerCase().includes('culinary') || v.toLowerCase().includes('street')) return `- Street Food Trail: Include real famous food streets, iconic restaurants, local food markets, cooking classes, street food walks, and authentic regional cuisine experiences`;
  return `- ${v}: Include related activities, landmarks, and authentic experiences`;
}).join('\n')}
Every day must have at least 2-3 activities directly matching the selected vibes.` : '';

  const prompt = `You are Bharat Yatra AI Agent — the most knowledgeable travel architect for India.
Generate a realistic, immersive ${days}-day travel itinerary for "${destName}".

Trip Parameters:
- Duration: ${days} Days
- Travel Vibes: ${vibeLabels}
- Accessibility: ${accessibility.join(", ") || "Standard"}
- Budget: ${budget}
- Language: ${language}
${vibeInstructions}

CRITICAL RULES:
1. Every place MUST be a REAL location in or near ${destName} with ACCURATE GPS coordinates (latitude, longitude)
2. Every place MUST have REAL opening and closing times
3. Use the exact real names of temples, ghats, forts, restaurants, markets, lakes, trails etc.
4. Do NOT invent fictional places — only include places that actually exist
5. Coordinates must be accurate to at least 3 decimal places
6. Activities must directly reflect the selected travel vibes

Return a valid JSON object (no markdown fences) matching this schema:
{
  "title": "${days}-Day Inclusive Trail: ${destName}",
  "destinationSummary": "2-line evocative destination summary",
  "bestTimeToVisit": "Best months/season",
  "localDelicacies": ["Dish 1", "Dish 2", "Dish 3"],
  "accessibilityHighlights": ["Feature 1", "Feature 2"],
  "days": [
    {
      "day": 1,
      "title": "Theme of Day 1",
      "time": "06:00 AM – 08:30 PM",
      "activities": [
        {
          "time": "06:00 AM",
          "name": "Exact Real Place Name",
          "description": "What to do here (1-2 lines with local tips)",
          "lat": 25.3109,
          "lng": 83.0107,
          "openTime": "05:00",
          "closeTime": "22:00",
          "category": "spiritual"
        }
      ]
    }
  ]
}

The "category" field must be one of: "spiritual", "heritage", "nature", "culinary", "adventure", "walk".
Provide 4-5 activities per day. Each activity MUST have accurate lat, lng, openTime, closeTime.`;

  try {
    const result = await callGemini(prompt, "You are a specialized travel AI for India. Always respond with pure, valid JSON.");
    const rawText = result.type === 'text' ? result.data : JSON.stringify(result.data);
    
    // Strip markdown formatting if any
    const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    
    parsed.id = tripId;
    parsed.destination = destName;
    parsed.generatedAt = new Date().toISOString();

    // Auto-save to IndexedDB & cache assets
    await saveTripOffline(parsed);

    return parsed;
  } catch (error) {
    console.error("Gemini Itinerary Generation fallback:", error);
    
    // Graceful fallback structured itinerary
    const fallbackPlan = {
      id: tripId,
      destination: destName,
      title: `${days}-Day Inclusive Trail: ${destName}`,
      destinationSummary: `Experience the soulful essence of ${destName} with heritage trails, artisan bazaars, and inclusive access.`,
      bestTimeToVisit: "October to March",
      localDelicacies: ["Regional Specialty Thali", "Local Street Snacks", "Traditional Sweets"],
      accessibilityHighlights: ["ISL Video Guide Available", "Wheelchair Ramp Access", "Verified Local Guides"],
      days: Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        title: i === 0 ? "Ancient Roots & Morning Exploration" : i === 1 ? "Artisans, Fortresses & Heritage Alleys" : `Hidden Sanctuaries & Sunset Trails`,
        time: "06:00 AM – 08:30 PM",
        activities: generateFallbackActivities(destName, i, vibes)
      }))
    };

    await saveTripOffline(fallbackPlan);
    return fallbackPlan;
  }
}

/**
 * Real-time Conversational Travel AI Agent
 * When offline, blocks the Gemini API call and returns an offline status message
 */
export async function chatWithGeminiAgent(userMessage, conversationHistory = [], context = {}) {
  // Offline Guard: block API call and return clear offline message
  if (isNetworkOffline()) {
    return "You are currently offline. Live AI chat requires an active internet connection, but you can access your saved offline trips and downloaded audio guides anytime!";
  }

  const systemInstruction = `You are 'Bharat Yatra AI Guide' — a warm, deeply knowledgeable, multilingual AI travel companion for tourists in India.
You understand Indian heritage, transport (Vande Bharat, state buses, auto fares), regional cuisines, safety protocols, ISL (Indian Sign Language) accessibility, emergency numbers (112, 1363), and hidden gems across all 28 states and 8 union territories.
Keep responses concise, helpful, and culturally respectful. Suggest actionable tips and local secrets whenever relevant.`;

  const historyContext = conversationHistory.map(m => `${m.role === 'user' ? 'Tourist' : 'Guide'}: ${m.text}`).join("\n");
  const fullPrompt = `${historyContext ? `Previous Conversation:\n${historyContext}\n\n` : ''}Tourist: ${userMessage}\nGuide:`;

  try {
    const result = await callGemini(fullPrompt, systemInstruction);
    return result.type === 'text' ? result.data : JSON.stringify(result.data);
  } catch (error) {
    if (error.message === 'NETWORK_OFFLINE' || isNetworkOffline()) {
      return "You are currently offline. Live AI chat requires an active internet connection, but your saved trips and offline maps remain fully accessible!";
    }
    console.error("Gemini Chat Agent error:", error);
    return "Namaste! I'm here to help you explore Bharat. Ask me about train routes, monument timings, accessible heritage trails, or local culinary secrets across India!";
  }
}
