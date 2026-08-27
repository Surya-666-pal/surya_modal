/**
 * Slot Extraction Service for Bharat Yatra AI Trip Planner (Steps 1, 3, 4, 5)
 * Uses Gemini Function Calling to extract structured travel parameters from user input.
 * Merges slots without overwriting existing data and generates targeted follow-up questions.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "REMOVED_SECRET";
const MODELS = ["gemini-3.6-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];

/**
 * Initial Empty Slot State
 */
export function getInitialSlotState() {
  return {
    start_city: null,
    days: null,
    budget: null,
    group_size: null,
    interests: [],
    accessibility_needs: []
  };
}

/**
 * Gemini Function Declaration for extract_trip_preferences
 */
export const extractTripPreferencesTool = {
  function_declarations: [
    {
      name: "extract_trip_preferences",
      description: "Extract structured India travel itinerary planning slots from the conversation",
      parameters: {
        type: "OBJECT",
        properties: {
          start_city: {
            type: "STRING",
            description: "City or region to explore (e.g., Varanasi, Jaipur, Kerala, Spiti Valley, Delhi, Hampi, Ladakh, Goa)"
          },
          days: {
            type: "INTEGER",
            description: "Number of trip duration days (e.g., 1, 2, 3, 4, 5, 7, 10)"
          },
          budget: {
            type: "STRING",
            description: "Budget tier or amount (e.g., 'Budget Explorer', 'Balanced Comfort', 'Luxury Heritage', '₹15,000', 'affordable')"
          },
          group_size: {
            type: "INTEGER",
            description: "Number of people traveling (e.g., 1 for solo, 2 for couple, 4 for family/friends)"
          },
          interests: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "Travel vibes or themes: 'heritage_forts', 'spiritual_ghats', 'lakes_tea_hills', 'trekking_passes', 'street_food' or human labels like 'Heritage', 'Temples', 'Food'"
          },
          accessibility_needs: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "Optional accessibility needs like 'wheelchair_ramp', 'isl_video', 'senior_friendly', 'audio_tour'"
          },
          is_confirmation: {
            type: "BOOLEAN",
            description: "True if the user is confirming the proposed summary (e.g., 'yes', 'sounds good', 'go ahead', 'confirm', 'perfect')"
          },
          is_modification_request: {
            type: "BOOLEAN",
            description: "True if the user is asking to modify an already generated plan or a specific day (e.g., 'make day 2 lighter', 'replace fort with a lake')"
          },
          modification_details: {
            type: "STRING",
            description: "Description of what specific change the user wants made"
          }
        }
      }
    }
  ]
};

/**
 * Rule-based fallback extractor if Gemini API is offline
 */
function extractSlotsRuleBased(userMessage, currentSlots) {
  const text = userMessage.toLowerCase();
  const updated = { ...currentSlots };

  // 1. Days extraction
  const daysMatch = text.match(/(\d+)\s*(?:day|days|d\b)/i);
  if (daysMatch) {
    const d = parseInt(daysMatch[1], 10);
    if (d > 0 && d <= 30) updated.days = d;
  }

  // 2. Group size extraction
  const groupMatch = text.match(/(\d+)\s*(?:people|person|travelers|friends|family|members|pax|of us)/i);
  if (groupMatch) {
    updated.group_size = parseInt(groupMatch[1], 10);
  } else if (text.includes("solo") || text.includes("alone") || text.includes("myself")) {
    updated.group_size = 1;
  } else if (text.includes("couple") || text.includes("wife") || text.includes("husband") || text.includes("partner")) {
    updated.group_size = 2;
  }

  // 3. City extraction
  const cities = [
    "varanasi", "sarnath", "delhi", "new delhi", "jaipur", "udaipur", "agra", "mumbai",
    "kolkata", "kerala", "munnar", "kochi", "alleppey", "hampi", "spiti", "ladakh",
    "leh", "rishikesh", "haridwar", "goa", "amritsar", "bengaluru", "bangalore",
    "chennai", "hyderabad", "lucknow", "meghalaya", "shillong", "jodhpur", "jaisalmer"
  ];
  for (const city of cities) {
    if (text.includes(city)) {
      updated.start_city = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  // 4. Budget extraction
  if (text.includes("luxury") || text.includes("5 star") || text.includes("heritage palace")) {
    updated.budget = "Luxury Heritage";
  } else if (text.includes("budget") || text.includes("cheap") || text.includes("backpack") || text.includes("hostel")) {
    updated.budget = "Budget Explorer";
  } else if (text.includes("comfort") || text.includes("mid") || text.includes("balanced") || text.includes("standard") || text.includes("₹") || text.includes("rs") || text.includes("inr")) {
    const amountMatch = text.match(/(?:₹|rs\.?|inr)\s*([\d,]+)/i);
    updated.budget = amountMatch ? `₹${amountMatch[1]}` : "Balanced Comfort";
  }

  // 5. Interests extraction
  const newInterests = new Set(updated.interests || []);
  if (text.includes("heritage") || text.includes("fort") || text.includes("palace") || text.includes("monument") || text.includes("history")) {
    newInterests.add("heritage_forts");
  }
  if (text.includes("spiritual") || text.includes("temple") || text.includes("ghat") || text.includes("aarti") || text.includes("mandir")) {
    newInterests.add("spiritual_ghats");
  }
  if (text.includes("lake") || text.includes("nature") || text.includes("tea") || text.includes("hill") || text.includes("waterfall")) {
    newInterests.add("lakes_tea_hills");
  }
  if (text.includes("trek") || text.includes("pass") || text.includes("hiking") || text.includes("adventure") || text.includes("mountain")) {
    newInterests.add("trekking_passes");
  }
  if (text.includes("food") || text.includes("chaat") || text.includes("culinary") || text.includes("eat") || text.includes("street food") || text.includes("thali")) {
    newInterests.add("street_food");
  }
  updated.interests = Array.from(newInterests);

  // 6. Accessibility extraction
  const newAccess = new Set(updated.accessibility_needs || []);
  if (text.includes("wheelchair") || text.includes("ramp") || text.includes("step free")) newAccess.add("wheelchair_ramp");
  if (text.includes("sign language") || text.includes("isl") || text.includes("deaf")) newAccess.add("isl_video");
  if (text.includes("audio") || text.includes("voice") || text.includes("blind")) newAccess.add("audio_tour");
  if (text.includes("senior") || text.includes("elderly") || text.includes("kid") || text.includes("child")) newAccess.add("senior_friendly");
  updated.accessibility_needs = Array.from(newAccess);

  return updated;
}

/**
 * Step 3: Extract structured slots using Gemini Function Calling
 */
export async function extractSlotsWithGemini(userMessage, currentSlots = getInitialSlotState(), conversationHistory = []) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return {
      slots: extractSlotsRuleBased(userMessage, currentSlots),
      isConfirmation: isUserAffirmative(userMessage),
      isModification: false
    };
  }

  const prompt = `Conversation history:
${conversationHistory.map(m => `${m.role}: ${m.text}`).join("\n")}

Latest User Message: "${userMessage}"

Current extracted slots so far:
${JSON.stringify(currentSlots, null, 2)}

Call the function "extract_trip_preferences" with any new or updated parameters found in the user message.
Never return empty values for slots that are already filled.`;

  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        tools: [extractTripPreferencesTool]
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) continue;

      const data = await res.json();
      const candidate = data.candidates?.[0];
      const functionCall = candidate?.content?.parts?.[0]?.functionCall;

      if (functionCall && functionCall.name === "extract_trip_preferences") {
        const args = functionCall.args || {};
        
        // Merge without overwriting existing non-null slots with empty values
        const mergedSlots = { ...currentSlots };
        if (args.start_city) mergedSlots.start_city = args.start_city;
        if (args.days) mergedSlots.days = Number(args.days);
        if (args.budget) mergedSlots.budget = args.budget;
        if (args.group_size) mergedSlots.group_size = Number(args.group_size);
        
        if (args.interests && Array.isArray(args.interests) && args.interests.length > 0) {
          const mappedInterests = args.interests.map(normInterest);
          mergedSlots.interests = Array.from(new Set([...(mergedSlots.interests || []), ...mappedInterests]));
        }

        if (args.accessibility_needs && Array.isArray(args.accessibility_needs) && args.accessibility_needs.length > 0) {
          mergedSlots.accessibility_needs = Array.from(new Set([...(mergedSlots.accessibility_needs || []), ...args.accessibility_needs]));
        }

        return {
          slots: mergedSlots,
          isConfirmation: Boolean(args.is_confirmation) || isUserAffirmative(userMessage),
          isModification: Boolean(args.is_modification_request),
          modificationDetails: args.modification_details || userMessage
        };
      }
    } catch (err) {
      console.warn(`[SlotExtraction] Gemini ${model} failed, attempting next:`, err.message);
    }
  }

  // Fallback to rule-based extractor
  return {
    slots: extractSlotsRuleBased(userMessage, currentSlots),
    isConfirmation: isUserAffirmative(userMessage),
    isModification: false
  };
}

function normInterest(interestStr) {
  const s = String(interestStr).toLowerCase();
  if (s.includes("fort") || s.includes("heritage") || s.includes("palace") || s.includes("history")) return "heritage_forts";
  if (s.includes("ghat") || s.includes("temple") || s.includes("spiritual") || s.includes("aarti")) return "spiritual_ghats";
  if (s.includes("lake") || s.includes("tea") || s.includes("hill") || s.includes("nature")) return "lakes_tea_hills";
  if (s.includes("trek") || s.includes("pass") || s.includes("trail") || s.includes("adventure")) return "trekking_passes";
  if (s.includes("food") || s.includes("culinary") || s.includes("chaat") || s.includes("street")) return "street_food";
  return s;
}

function isUserAffirmative(text) {
  const t = text.toLowerCase().trim();
  return (
    t === "yes" || t === "y" || t === "yeah" || t === "yep" || t === "sure" || 
    t === "confirm" || t === "confirmed" || t.includes("sounds good") || 
    t.includes("go ahead") || t.includes("perfect") || t.includes("let's do it") ||
    t.includes("generate") || t.includes("start") || t.includes("proceed") ||
    t.includes("looks good") || t.includes("sound good")
  );
}

/**
 * Step 4: Check Slot Completeness
 * Required: start_city, days, budget, group_size, interests (at least 1)
 * Optional: accessibility_needs
 */
export function checkSlotCompleteness(slots) {
  const missingSlots = [];

  if (!slots.start_city) missingSlots.push("start_city");
  if (!slots.days) missingSlots.push("days");
  if (!slots.budget) missingSlots.push("budget");
  if (!slots.group_size) missingSlots.push("group_size");
  if (!slots.interests || slots.interests.length === 0) missingSlots.push("interests");

  return {
    isComplete: missingSlots.length === 0,
    missingSlots,
    nextMissingSlot: missingSlots[0] || null
  };
}

/**
 * Step 4 Follow-up Question Generator (Asks ONE targeted question at a time)
 */
export function getSingleFollowUpQuestion(missingSlot, currentSlots) {
  switch (missingSlot) {
    case "start_city":
      return "Namaste! 🙏 Which city or iconic region in India would you like to explore? (e.g. Varanasi, Spiti Valley, Kerala, Jaipur, Hampi)";
    case "days":
      return `Wonderful! How many days would you like to spend exploring ${currentSlots.start_city || "this destination"}? (e.g. 3 days, 5 days)`;
    case "group_size":
      return "How many travelers will be on this journey? (e.g. Solo, 2 people, family of 4)";
    case "budget":
      return "What budget tier do you prefer for stays and travel? (Budget Explorer, Balanced Comfort, or Luxury Heritage)";
    case "interests":
      return "What travel vibes excite you the most? Choose one or more: 🏰 Heritage & Forts, 🪔 Spiritual Ghats, 🌿 Lakes & Tea Hills, 🏔️ Trekking & Passes, or 🍛 Street Food Trail.";
    default:
      return "Are there any accessibility preferences or specific wishes you would like included?";
  }
}

/**
 * Step 5: Confirmation Summary Formatter
 */
export function formatConfirmationSummary(slots) {
  const interestLabels = (slots.interests || []).map(i => {
    if (i === "heritage_forts") return "Heritage & Forts 🏰";
    if (i === "spiritual_ghats") return "Spiritual Ghats 🪔";
    if (i === "lakes_tea_hills") return "Lakes & Tea Hills 🌿";
    if (i === "trekking_passes") return "Trekking & Passes 🏔️";
    if (i === "street_food") return "Street Food Trail 🍛";
    return i;
  }).join(", ");

  const accessNote = slots.accessibility_needs && slots.accessibility_needs.length > 0
    ? ` with ${slots.accessibility_needs.join(", ")} support`
    : "";

  return `Here is your trip blueprint:
📍 **Destination:** ${slots.start_city}
⏱️ **Duration:** ${slots.days} Days
👥 **Travelers:** ${slots.group_size} ${slots.group_size === 1 ? 'Person' : 'People'}
💰 **Budget:** ${slots.budget}
🎯 **Vibes:** ${interestLabels || 'Cultural Highlights'}${accessNote}

Shall I generate your verified day-wise itinerary now? (Reply "Yes" or tell me any changes!)`;
}
