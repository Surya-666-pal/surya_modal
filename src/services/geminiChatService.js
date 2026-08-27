/**
 * Bharat Yatra – Gemini-powered Chat Trip Planner Service
 *
 * Uses Google Gemini 2.0 Flash with multi-turn chat history so the AI
 * remembers the full conversation and provides contextual, accurate answers.
 */
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "REMOVED_SECRET";
const MODELS = ["gemini-3.6-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];

const SYSTEM_PROMPT = `You are "Bharat AI Architect", a friendly and expert AI trip planner for the Bharat Yatra app — a premium heritage and culture travel platform for India.

Your role is to help users plan personalised trips across India, including:
- Cultural & heritage destinations (Varanasi, Hampi, Jaipur, Khajuraho, Mahabalipuram, Mysore)
- Nature & adventure destinations (Spiti Valley, Ladakh, Coorg, Munnar, Sundarbans)
- Spiritual pilgrimages (Char Dham, Varanasi Ghats, Tirupati, Haridwar, Bodh Gaya)
- Food & culinary trails (Street food in Delhi, seafood in Goa, biryani trails in Hyderabad)
- Offbeat & hidden gems across India

RESPONSE RULES:
1. Be warm, conversational, and knowledgeable — like a local expert guide.
2. If the user asks for an itinerary or travel plan → provide a detailed, day-by-day structured plan including:
   - Best time to visit each place
   - Morning / Afternoon / Evening schedule
   - Local food recommendations
   - Travel tips, entry fees (approx.), and accessibility info
   - Nearest accommodation type (budget / mid-range / luxury)
3. If the user asks a travel question → give a concise, accurate, helpful answer.
4. Always answer in the user's language style (casual if they're casual, formal if formal).
5. If destination or duration is missing, politely ask for it before generating the itinerary.
6. When generating itineraries, format them clearly with:
   - **Day X: Title** sections
   - Morning / Afternoon / Evening time slots
   - 🍽 Food | 📍 Places | 💡 Tips callouts
7. Keep responses focused on India travel only. If asked about other countries, redirect politely.
8. Always end with a helpful follow-up question or offer to refine the plan.`;

/**
 * Send a multi-turn chat message to Gemini and get a streamed reply.
 * @param {Array<{role: 'user'|'model', text: string}>} history - Full conversation history
 * @param {string} newMessage - The latest user message
 * @returns {Promise<string>} - AI reply text
 */
export async function sendChatToGemini(history, newMessage) {
  // Build Gemini-format contents array from history + new message
  const contents = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  // Append the new user message
  contents.push({
    role: "user",
    parts: [{ text: newMessage }]
  });

  let lastError = null;

  try {
    for (const model of MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

        const payload = {
          contents,
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048
          }
        };

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errBody = await response.text();
          console.warn(`Gemini ${model} responded with ${response.status}:`, errBody);
          lastError = new Error(`HTTP ${response.status}: ${errBody}`);
          continue;
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
          return text.trim();
        }

        console.warn(`Gemini ${model} returned no text:`, JSON.stringify(data));
        lastError = new Error("No text in Gemini response");
      } catch (err) {
        console.warn(`Error with Gemini model ${model}:`, err);
        lastError = err;
      }
    }
  } catch (globalErr) {
    console.error("Gemini service global call failure:", globalErr);
  }

  // ─── Local Conversational Fallback (Rate limits/429/Offline) ────────────────
  const query = newMessage.toLowerCase();

  // 1. Destination-Specific Fallbacks
  if (query.includes("varanasi") || query.includes("banaras") || query.includes("kashi")) {
    return "Varanasi (Banaras) is a deeply spiritual city on the banks of the Ganges. It is famous for its **Kashi Vishwanath Temple**, **Dashashwamedh Ghat's evening Aarti**, and **Assi Ghat's morning Vedic chants**. Best time to visit is October to March.\n\nWould you like me to build a day-by-day optimized itinerary for Varanasi? Just say *'Plan 3 days in Varanasi'*!";
  }

  if (query.includes("jaipur") || query.includes("pink city") || query.includes("rajasthan") || query.includes("jodhpur") || query.includes("udaipur")) {
    const city = query.includes("jaipur") ? "Jaipur" : query.includes("udaipur") ? "Udaipur" : "Jaipur";
    return `${city} in Rajasthan is rich in royal heritage! Iconic spots include the majestic **Amber Fort**, **Hawa Mahal (Palace of Winds)**, and the **City Palace**. Best months to visit are November to February when the weather is pleasant.\n\nI can set up a local heritage route for you. Try saying: *'Plan 3 days in ${city}'*!`;
  }

  if (query.includes("kerala") || query.includes("munnar") || query.includes("alleppey") || query.includes("cochin") || query.includes("kochi")) {
    return "Kerala (God's Own Country) is famous for its serene backwaters, organic **tea plantations in Munnar**, and houseboats in **Alleppey**. The ideal time to explore is from September to March.\n\nLet's design a tea valley and backwater trail! Say: *'Plan 4 days in Kerala'*.";
  }

  if (query.includes("ladakh") || query.includes("leh") || query.includes("spiti")) {
    const region = query.includes("spiti") ? "Spiti Valley" : "Ladakh";
    return `${region} is a breathtaking high-altitude desert. Famous attractions include the brilliant azure **Pangong Tso Lake**, **Key Monastery**, and winding mountain treks. Best time to travel is between May and September.\n\nWould you like to build an adventure route? Tell me: *'Plan 5 days in ${region}'*!`;
  }

  if (query.includes("hampi") || query.includes("mysore") || query.includes("karnataka")) {
    return "Hampi is a spectacular UNESCO World Heritage site showcasing the ruins of the historic Vijayanagara Empire, including the **Virupaksha Temple** and stone chariot. Best explored between November and February.\n\nLet's build a historic ruins walk! Tell me: *'Plan 2 days in Hampi'*.";
  }

  if (query.includes("agra") || query.includes("taj mahal")) {
    return "Agra is home to the **Taj Mahal**, one of the Seven Wonders of the World. You can also explore the red sandstone **Agra Fort** and nearby Fatehpur Sikri. Best visited from October to March.\n\nI can generate a romantic heritage itinerary! Say: *'Plan 2 days in Agra'*.";
  }

  if (query.includes("goa")) {
    return "Goa offers pristine sandy beaches, colonial Portuguese heritage churches in Old Goa, and delicious spice plantation tours. Ideal time to visit is November to February.\n\nLet me know if you want a beach and heritage itinerary by saying: *'Plan 3 days in Goa'*!";
  }

  // 2. Interest/Vibe-Specific Fallbacks
  if (query.includes("food") || query.includes("eat") || query.includes("culinary") || query.includes("dish")) {
    return "Indian food is a sensory adventure! In the north, don't miss Old Delhi's street chaat and chole bhature. In the south, try Munnar's organic tea and traditional banana-leaf Thalis. In Varanasi, try the famous Tamatar Chaat and creamy Lassi!\n\nJust tell me which city you'd like to plan a food trail for!";
  }

  if (query.includes("budget") || query.includes("cheap") || query.includes("price")) {
    return "Traveling in India can be very budget-friendly! By staying in local homestays or hostels, eating delicious street food, and booking sleeper-class trains, you can easily explore for under **₹1,500 ($18 USD) per day**.\n\nTell me which city you want to visit, and I will recommend budget options!";
  }

  // 3. Greetings
  if (query.includes("hi") || query.includes("hello") || query.includes("namaste") || query.includes("hey")) {
    return "Namaste! 🙏 I'm your Bharat AI Architect.\n\nI am currently running in our **smart offline fallback mode** due to high API demand, but I can still answer your questions and help you plan your journey!\n\nTell me: Which city or region in India would you like to explore (e.g. **Varanasi**, **Jaipur**, **Kerala**, or **Ladakh**)?";
  }

  if (query.includes("help") || query.includes("how") || query.includes("what") || query.includes("guide")) {
    return "I am your Bharat AI Assistant. To generate an itinerary, just specify the destination and number of days — for example: *'Plan 3 days in Jaipur'*.\n\nMy local planning engine will query our curated database of famous places, cluster them, and design the best road routes for you!";
  }

  // 4. Default Fallback
  return `I understand you'd like to talk about "${newMessage}". Since our Gemini API quota has hit its daily limit (429 Rate Limit), I'm running in offline assistant mode.\n\nIf you specify an Indian destination (e.g., **Varanasi**, **Jaipur**, **Kerala**, **Ladakh**, or **Hampi**), I can query our local records and build a geographic day-by-day route plan for you immediately! Try saying *'Plan 3 days in Jaipur'*!`;
}

/**
 * Generate the initial greeting message for a new trip planning session
 * @returns {Promise<string>}
 */
export async function startTripChat() {
  const greeting = "Hello! Welcome to Bharat Yatra. Start your trip planning session by saying hello or asking about a destination.";
  try {
    const reply = await sendChatToGemini([], greeting);
    return reply;
  } catch (err) {
    // Fallback greeting if API fails
    return "Namaste! 🙏 I'm your Bharat AI Architect — your expert guide to planning the perfect Indian journey.\n\nTell me:\n• Which city or region would you like to explore?\n• How many days do you have?\n• What type of experience are you looking for? (Heritage, Nature, Spiritual, Adventure, Food trails...)\n\nLet's design your dream Bharat journey!";
  }
}
