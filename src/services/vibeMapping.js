/**
 * Vibe Mapping Configuration for Bharat Yatra Hidden Gems & Explore Search
 * Defines strict Google Places API types, keywords, safety net exclusions,
 * and authentic city-specific fallback datasets per vibe.
 */

export const VIBE_MAPPING = {
  heritage_forts: {
    id: "heritage_forts",
    label: "Heritage & Forts",
    emoji: "🏰",
    type: "tourist_attraction",
    keywords: ["fort", "palace", "heritage site", "monument"],
    allowedTypes: [
      "tourist_attraction",
      "museum",
      "historical_landmark",
      "monument",
      "castle",
      "archaeological_site",
      "place_of_interest"
    ],
    forbiddenTypes: [
      "hindu_temple",
      "place_of_worship",
      "restaurant",
      "food",
      "cafe",
      "bakery",
      "meal_takeaway"
    ],
    matchKeywords: [
      "fort", "palace", "mahal", "cenotaph", "monument", "citadel", 
      "ruins", "heritage", "museum", "haveli", "stupa", "tomb", "citadel", "bastion"
    ]
  },

  spiritual_ghats: {
    id: "spiritual_ghats",
    label: "Spiritual Ghats",
    emoji: "🪔",
    type: "hindu_temple",
    keywords: ["ghat", "temple", "spiritual site"],
    allowedTypes: [
      "hindu_temple",
      "place_of_worship",
      "monastery",
      "shrine",
      "ashram",
      "religious_destination"
    ],
    forbiddenTypes: [
      "restaurant",
      "bar",
      "night_club",
      "amusement_park",
      "shopping_mall"
    ],
    matchKeywords: [
      "ghat", "temple", "mandir", "aarti", "spiritual", "ashram", 
      "matha", "jyotirlinga", "kund", "peeth", "shrine", "sangam"
    ]
  },

  lakes_tea_hills: {
    id: "lakes_tea_hills",
    label: "Lakes & Tea Hills",
    emoji: "🌿",
    type: "natural_feature",
    keywords: ["lake", "tea garden", "hill station", "viewpoint"],
    allowedTypes: [
      "natural_feature",
      "park",
      "campground",
      "botanical_garden",
      "tourist_attraction",
      "scenic_viewpoint"
    ],
    forbiddenTypes: [
      "hindu_temple",
      "place_of_worship",
      "restaurant",
      "bakery",
      "night_club"
    ],
    matchKeywords: [
      "lake", "tso", "tal", "tea", "hill", "viewpoint", "valley", 
      "falls", "waterfall", "garden", "river", "scenic", "plantation", "peak", "plateau"
    ]
  },

  trekking_passes: {
    id: "trekking_passes",
    label: "Trekking & Passes",
    emoji: "🏔️",
    type: "tourist_attraction",
    keywords: ["trek", "mountain pass", "trail", "trekking route"],
    allowedTypes: [
      "tourist_attraction",
      "natural_feature",
      "park",
      "campground",
      "hiking_area",
      "mountain_pass"
    ],
    forbiddenTypes: [
      "hindu_temple",
      "place_of_worship",
      "restaurant",
      "food",
      "bar",
      "bakery"
    ],
    matchKeywords: [
      "trek", "pass", "la", "trail", "ridge", "peak", "climb", 
      "hiking", "route", "gorge", "glacier", "expedition"
    ]
  },

  street_food: {
    id: "street_food",
    label: "Street Food Trail",
    emoji: "🍛",
    type: "restaurant",
    keywords: ["street food", "local food", "food street", "chaat"],
    allowedTypes: [
      "restaurant",
      "food",
      "cafe",
      "bakery",
      "meal_takeaway",
      "meal_delivery"
    ],
    forbiddenTypes: [
      "hindu_temple",
      "place_of_worship",
      "museum",
      "natural_feature",
      "campground"
    ],
    matchKeywords: [
      "food", "chaat", "mithai", "kachori", "sweet", "bazaar", 
      "snack", "dhaba", "thali", "restaurant", "tea", "chai", 
      "lassi", "kebab", "biryani", "paranthe", "gully", "chowk"
    ]
  }
};

export const VIBE_CHIPS = Object.values(VIBE_MAPPING);

/**
 * City Center Coordinates & Radius for Location Bias (meters)
 */
export const CITY_COORDINATES = {
  "varanasi": { lat: 25.3176, lng: 82.9739, radius: 25000 },
  "banaras": { lat: 25.3176, lng: 82.9739, radius: 25000 },
  "kashi": { lat: 25.3176, lng: 82.9739, radius: 25000 },
  "sarnath": { lat: 25.3811, lng: 83.0214, radius: 15000 },
  "delhi": { lat: 28.6139, lng: 77.2090, radius: 35000 },
  "new delhi": { lat: 28.6139, lng: 77.2090, radius: 35000 },
  "jaipur": { lat: 26.9124, lng: 75.7873, radius: 25000 },
  "udaipur": { lat: 24.5854, lng: 73.7125, radius: 25000 },
  "jodhpur": { lat: 26.2389, lng: 73.0243, radius: 25000 },
  "jaisalmer": { lat: 26.9157, lng: 70.9083, radius: 30000 },
  "bikaner": { lat: 28.0229, lng: 73.3119, radius: 20000 },
  "pushkar": { lat: 26.4897, lng: 74.5511, radius: 15000 },
  "agra": { lat: 27.1767, lng: 78.0081, radius: 20000 },
  "mathura": { lat: 27.4924, lng: 77.6737, radius: 20000 },
  "vrindavan": { lat: 27.5793, lng: 77.6975, radius: 15000 },
  "ayodhya": { lat: 26.7922, lng: 82.1998, radius: 20000 },
  "lucknow": { lat: 26.8467, lng: 80.9462, radius: 25000 },
  "prayagraj": { lat: 25.4358, lng: 81.8463, radius: 25000 },
  "allahabad": { lat: 25.4358, lng: 81.8463, radius: 25000 },
  "mumbai": { lat: 19.0760, lng: 72.8777, radius: 35000 },
  "pune": { lat: 18.5204, lng: 73.8567, radius: 30000 },
  "kolkata": { lat: 22.5726, lng: 88.3639, radius: 30000 },
  "kerala": { lat: 9.9312, lng: 76.2673, radius: 50000 },
  "kochi": { lat: 9.9312, lng: 76.2673, radius: 25000 },
  "cochin": { lat: 9.9312, lng: 76.2673, radius: 25000 },
  "munnar": { lat: 10.0889, lng: 77.0595, radius: 30000 },
  "alleppey": { lat: 9.4981, lng: 76.3388, radius: 25000 },
  "alappuzha": { lat: 9.4981, lng: 76.3388, radius: 25000 },
  "thekkady": { lat: 9.5998, lng: 77.1694, radius: 25000 },
  "kozhikode": { lat: 11.2588, lng: 75.7804, radius: 25000 },
  "thrissur": { lat: 10.5276, lng: 76.2144, radius: 20000 },
  "hampi": { lat: 15.3350, lng: 76.4600, radius: 25000 },
  "mysuru": { lat: 12.2958, lng: 76.6394, radius: 25000 },
  "mysore": { lat: 12.2958, lng: 76.6394, radius: 25000 },
  "bengaluru": { lat: 12.9716, lng: 77.5946, radius: 30000 },
  "bangalore": { lat: 12.9716, lng: 77.5946, radius: 30000 },
  "spiti": { lat: 32.2461, lng: 78.0349, radius: 50000 },
  "ladakh": { lat: 34.1526, lng: 77.5771, radius: 50000 },
  "leh": { lat: 34.1526, lng: 77.5771, radius: 30000 },
  "nubra": { lat: 34.7519, lng: 77.5803, radius: 30000 },
  "pangong": { lat: 33.7585, lng: 78.6506, radius: 30000 },
  "manali": { lat: 32.2432, lng: 77.1892, radius: 25000 },
  "dharamsala": { lat: 32.2190, lng: 76.3234, radius: 20000 },
  "shimla": { lat: 31.1048, lng: 77.1734, radius: 20000 },
  "rishikesh": { lat: 30.0869, lng: 78.2676, radius: 25000 },
  "haridwar": { lat: 29.9457, lng: 78.1642, radius: 25000 },
  "kedarnath": { lat: 30.7346, lng: 79.0669, radius: 15000 },
  "badrinath": { lat: 30.7433, lng: 79.4938, radius: 15000 },
  "gangotri": { lat: 30.9946, lng: 78.9391, radius: 15000 },
  "goa": { lat: 15.2993, lng: 74.1240, radius: 40000 },
  "amritsar": { lat: 31.6340, lng: 74.8723, radius: 20000 },
  "chandigarh": { lat: 30.7333, lng: 76.7794, radius: 25000 },
  "chennai": { lat: 13.0827, lng: 80.2707, radius: 30000 },
  "madurai": { lat: 9.9252, lng: 78.1198, radius: 20000 },
  "rameshwaram": { lat: 9.2876, lng: 79.3129, radius: 15000 },
  "kanyakumari": { lat: 8.0883, lng: 77.5385, radius: 15000 },
  "hyderabad": { lat: 17.3850, lng: 78.4867, radius: 30000 },
  "warangal": { lat: 17.9689, lng: 79.5941, radius: 20000 },
  "meghalaya": { lat: 25.4670, lng: 91.3662, radius: 50000 },
  "shillong": { lat: 25.5788, lng: 91.8933, radius: 25000 },
  "cherrapunji": { lat: 25.2800, lng: 91.7170, radius: 20000 },
  "kaziranga": { lat: 26.5775, lng: 93.1710, radius: 30000 },
  "sikkim": { lat: 27.5330, lng: 88.5122, radius: 50000 },
  "gangtok": { lat: 27.3314, lng: 88.6138, radius: 20000 },
  "india": { lat: 22.5937, lng: 78.9629, radius: 1500000 }
};

/**
 * Resolve location bias center and radius in meters for any Indian city or region.
 * FIXED: Uses fuzzy partial-string matching so "Varanasi & Sarnath" hits "varanasi".
 */
export function resolveLocationBias(cityOrRegion = "India") {
  if (!cityOrRegion) return { city: "India", lat: 22.5937, lng: 78.9629, radius: 1500000 };

  const normalized = cityOrRegion.toLowerCase().trim();

  // 1. Exact key match
  if (CITY_COORDINATES[normalized]) {
    const c = CITY_COORDINATES[normalized];
    return { city: normalized, lat: c.lat, lng: c.lng, radius: c.radius };
  }

  // 2. Key contained in input (e.g. "varanasi" in "varanasi & sarnath")
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (key === 'india') continue;
    if (normalized.includes(key)) {
      return { city: key, lat: coords.lat, lng: coords.lng, radius: coords.radius };
    }
  }

  // 3. Input contained in key (e.g. "spiti" matches "spiti valley")
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (key === 'india') continue;
    if (key.includes(normalized)) {
      return { city: key, lat: coords.lat, lng: coords.lng, radius: coords.radius };
    }
  }

  // 4. Fallback: all-India search
  console.warn(`[VibeMapping] City "${cityOrRegion}" not found in CITY_COORDINATES — using India-wide search.`);
  return { city: "India", lat: 22.5937, lng: 78.9629, radius: 1500000 };
}


/**
 * Curated, vibe-pure fallback datasets with ZERO crossover:
 * - heritage_forts contains ONLY forts/palaces/monuments
 * - spiritual_ghats contains ONLY ghats/temples/ashrams
 * - lakes_tea_hills contains ONLY lakes/waterfalls/plantations/viewpoints
 * - trekking_passes contains ONLY trek trails/mountain passes
 * - street_food contains ONLY food streets/chaat gullies/culinary trails
 */
export const CURATED_FALLBACK_GEMS = {
  heritage_forts: [
    {
      id: "hf_orchha_01",
      place_id: "hf_orchha_01",
      name: "Orchha Jahangir Mahal & Bundela Palaces",
      state: "Madhya Pradesh",
      category: "Heritage & Forts",
      image: "https://images.unsplash.com/photo-1600100397608-f010e4224716?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Moderate",
      rating: 4.91,
      description: "Grand 16th-century Bundela royal fortress rising over the Betwa riverbank, with stone jali screens and painted murals.",
      vibes: ["heritage_forts"],
      types: ["tourist_attraction", "historical_landmark", "castle"]
    },
    {
      id: "hf_gandikota_02",
      place_id: "hf_gandikota_02",
      name: "Gandikota Fort & Gorge Citadel",
      state: "Andhra Pradesh",
      category: "Heritage & Forts",
      image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Peaceful",
      rating: 4.88,
      description: "Spectacular 13th-century red sandstone canyon fortress perched above the deep Penna River gorge.",
      vibes: ["heritage_forts"],
      types: ["tourist_attraction", "historical_landmark", "monument"]
    },
    {
      id: "hf_bhangarh_03",
      place_id: "hf_bhangarh_03",
      name: "Bhangarh Fort Ruins",
      state: "Rajasthan",
      category: "Heritage & Forts",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Low (Uncrowded)",
      rating: 4.72,
      description: "Pre-Mughal ruined citadel nestled under the dramatic Aravalli cliff ramparts, protected by the Archaeological Survey of India.",
      vibes: ["heritage_forts"],
      types: ["historical_landmark", "tourist_attraction", "archaeological_site"]
    },
    {
      id: "hf_chittorgarh_04",
      place_id: "hf_chittorgarh_04",
      name: "Chittorgarh Fort & Vijay Stambha",
      state: "Rajasthan",
      category: "Heritage & Forts",
      image: "https://images.unsplash.com/photo-1623682687826-fe06bf64e6d8?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Moderate",
      rating: 4.94,
      description: "Asia's largest hilltop fortress encompassing 700 acres of Rajput history, towers of victory, and royal pavilions.",
      vibes: ["heritage_forts"],
      types: ["tourist_attraction", "monument", "historical_landmark"]
    },
    {
      id: "hf_ramnagar_05",
      place_id: "hf_ramnagar_05",
      name: "Ramnagar Fort & Royal Armory",
      state: "Uttar Pradesh",
      category: "Heritage & Forts",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Moderate",
      rating: 4.86,
      description: "18th-century cream sandstone river fortress housing vintage astronomical clocks, royal palanquins, and antique weaponry.",
      vibes: ["heritage_forts"],
      types: ["museum", "historical_landmark", "tourist_attraction"]
    }
  ],

  spiritual_ghats: [
    {
      id: "sg_varanasi_01",
      place_id: "sg_varanasi_01",
      name: "Dashashwamedh Ghat & Evening Aarti",
      state: "Uttar Pradesh",
      category: "Spiritual Ghats",
      image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Vibrant",
      rating: 4.97,
      description: "Varanasi's central sacred riverfront where priests conduct multi-tiered brass lamp aarti ceremonies at sunset.",
      vibes: ["spiritual_ghats"],
      types: ["place_of_worship", "hindu_temple"]
    },
    {
      id: "sg_assi_02",
      place_id: "sg_assi_02",
      name: "Assi Ghat Subah-e-Banaras Rituals",
      state: "Uttar Pradesh",
      category: "Spiritual Ghats",
      image: "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Peaceful",
      rating: 4.92,
      description: "Sacred confluence of Assi and Ganga with dawn Vedic chanting, yoga mandapas, and morning yajna havans.",
      vibes: ["spiritual_ghats"],
      types: ["place_of_worship", "hindu_temple"]
    },
    {
      id: "sg_pushkar_03",
      place_id: "sg_pushkar_03",
      name: "Pushkar Sacred Lake Ghats & Brahma Temple",
      state: "Rajasthan",
      category: "Spiritual Ghats",
      image: "https://images.unsplash.com/photo-1609947017136-9daf32a15c28?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Moderate",
      rating: 4.89,
      description: "52 holy bathing ghats surrounding the desert lake and the world's most venerated 14th-century Lord Brahma shrine.",
      vibes: ["spiritual_ghats"],
      types: ["hindu_temple", "place_of_worship"]
    },
    {
      id: "sg_rishikesh_04",
      place_id: "sg_rishikesh_04",
      name: "Rishikesh Triveni Ghat Mahavishnu Aarti",
      state: "Uttarakhand",
      category: "Spiritual Ghats",
      image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Moderate",
      rating: 4.92,
      description: "Holy convergence of Ganga, Yamuna, and Saraswati where devotees release thousands of floating leaf lamps onto the waters.",
      vibes: ["spiritual_ghats"],
      types: ["place_of_worship", "hindu_temple", "ashram"]
    },
    {
      id: "sg_haridwar_05",
      place_id: "sg_haridwar_05",
      name: "Haridwar Har Ki Pauri Brahmakund",
      state: "Uttarakhand",
      category: "Spiritual Ghats",
      image: "https://images.unsplash.com/photo-1591018653367-700f970c644b?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Vibrant",
      rating: 4.90,
      description: "Sacred river steps where the Ganga enters the Indo-Gangetic plains, preserving the sacred footprint of Lord Vishnu.",
      vibes: ["spiritual_ghats"],
      types: ["hindu_temple", "place_of_worship"]
    }
  ],

  lakes_tea_hills: [
    {
      id: "lt_mawlynnong_01",
      place_id: "lt_mawlynnong_01",
      name: "Living Root Bridges & Umngot River Basin",
      state: "Meghalaya",
      category: "Lakes & Tea Hills",
      image: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Low (Uncrowded)",
      rating: 4.97,
      description: "Bio-engineered botanical bridges woven from Ficus elastica tree roots over crystal jungle cascades in the East Khasi Hills.",
      vibes: ["lakes_tea_hills"],
      types: ["natural_feature", "park"]
    },
    {
      id: "lt_pangong_02",
      place_id: "lt_pangong_02",
      name: "Pangong Tso High-Altitude Saline Lake",
      state: "Ladakh",
      category: "Lakes & Tea Hills",
      image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Low (Uncrowded)",
      rating: 4.96,
      description: "Trans-Himalayan endorheic lake at 14,270 ft that shifts from azure blue to deep emerald under changing sunlight.",
      vibes: ["lakes_tea_hills"],
      types: ["natural_feature", "tourist_attraction"]
    },
    {
      id: "lt_munnar_03",
      place_id: "lt_munnar_03",
      name: "Munnar Kolukkumalai Organic Tea Estates",
      state: "Kerala",
      category: "Lakes & Tea Hills",
      image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Moderate",
      rating: 4.91,
      description: "The world's highest tea plantation at 7,900 ft overlooking panoramic cloud beds in the Western Ghats.",
      vibes: ["lakes_tea_hills"],
      types: ["natural_feature", "scenic_viewpoint"]
    },
    {
      id: "lt_gurudongmar_04",
      place_id: "lt_gurudongmar_04",
      name: "Gurudongmar Glacial Lake",
      state: "Sikkim",
      category: "Lakes & Tea Hills",
      image: "https://images.unsplash.com/photo-1623591264432-20adc42e0c46?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Serene",
      rating: 4.95,
      description: "Glacial alpine lake at 17,800 ft surrounded by snow-capped peaks in the Kanchenjunga biosphere range.",
      vibes: ["lakes_tea_hills"],
      types: ["natural_feature"]
    },
    {
      id: "lt_dawki_05",
      place_id: "lt_dawki_05",
      name: "Dawki Transparent Glass Lake Waters",
      state: "Meghalaya",
      category: "Lakes & Tea Hills",
      image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Hidden Gem",
      rating: 4.93,
      description: "Glass-clear emerald waters where wooden boats appear suspended in air above smooth river stones.",
      vibes: ["lakes_tea_hills"],
      types: ["natural_feature", "tourist_attraction"]
    }
  ],

  trekking_passes: [
    {
      id: "tp_sela_01",
      place_id: "tp_sela_01",
      name: "Sela Pass & High-Altitude Ridge Trail",
      state: "Arunachal Pradesh",
      category: "Trekking & Passes",
      image: "https://images.unsplash.com/photo-1561359313-0639aad49ca6?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Serene",
      rating: 4.98,
      description: "Strategic Himalayan mountain pass at 13,700 ft with 101 frozen sacred lakes and prayer flag alpine routes.",
      vibes: ["trekking_passes"],
      types: ["mountain_pass", "hiking_area", "natural_feature"]
    },
    {
      id: "tp_flowers_02",
      place_id: "tp_flowers_02",
      name: "Valley of Flowers National Park Alpine Trek",
      state: "Uttarakhand",
      category: "Trekking & Passes",
      image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Low (Uncrowded)",
      rating: 4.95,
      description: "High-altitude Himalayan trek through sub-alpine meadows hosting 500+ species of wild endemic flora.",
      vibes: ["trekking_passes"],
      types: ["hiking_area", "park", "tourist_attraction"]
    },
    {
      id: "tp_chadar_03",
      place_id: "tp_chadar_03",
      name: "Chadar Frozen Zanskar River Trek",
      state: "Ladakh",
      category: "Trekking & Passes",
      image: "https://images.unsplash.com/photo-1486911278844-a81c5267e227?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Extreme Adventure",
      rating: 4.93,
      description: "Winter walking expedition across the sheet-ice of the Zanskar River canyon in sub-zero trans-Himalayan temperatures.",
      vibes: ["trekking_passes"],
      types: ["hiking_area", "natural_feature"]
    },
    {
      id: "tp_pinparvati_04",
      place_id: "tp_pinparvati_04",
      name: "Pin Parvati Pass Trans-Himalayan Trail",
      state: "Himachal Pradesh",
      category: "Trekking & Passes",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Low (Uncrowded)",
      rating: 4.90,
      description: "Glacial alpine trek at 17,450 ft crossing between the lush Parvati Valley and the stark moonscapes of Spiti.",
      vibes: ["trekking_passes"],
      types: ["mountain_pass", "hiking_area"]
    },
    {
      id: "tp_sandakphu_05",
      place_id: "tp_sandakphu_05",
      name: "Sandakphu Singalila Ridge Trek",
      state: "West Bengal",
      category: "Trekking & Passes",
      image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Moderate",
      rating: 4.88,
      description: "Ridge trek at 11,930 ft offering unhindered vistas of the Sleeping Buddha massif: Everest, Kanchenjunga, and Lhotse.",
      vibes: ["trekking_passes"],
      types: ["hiking_area", "mountain_pass"]
    }
  ],

  street_food: [
    {
      id: "sf_delhi_01",
      place_id: "sf_delhi_01",
      name: "Chandni Chowk Paranthe Wali Gali",
      state: "Delhi",
      category: "Street Food Trail",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Vibrant",
      rating: 4.94,
      description: "Centuries-old cul-de-sac of heritage parantha shops serving rabri-jalebi, rabdi falooda, and spicy potato-stuffed flatbreads.",
      vibes: ["street_food"],
      types: ["restaurant", "food"]
    },
    {
      id: "sf_varanasi_02",
      place_id: "sf_varanasi_02",
      name: "Godowlia Chowk Tamatar Chaat & Lassi",
      state: "Uttar Pradesh",
      category: "Street Food Trail",
      image: "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Vibrant",
      rating: 4.89,
      description: "Iconic street food corner famous for clay-pot spicy tamatar chaat, saffron malaiyo foam, and thick churned lassi.",
      vibes: ["street_food"],
      types: ["restaurant", "food", "cafe"]
    },
    {
      id: "sf_lucknow_03",
      place_id: "sf_lucknow_03",
      name: "Aminabad & Chowk Awadhi Culinary Trail",
      state: "Uttar Pradesh",
      category: "Street Food Trail",
      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Moderate",
      rating: 4.92,
      description: "Nawabi street food haven renowned for melt-in-mouth galawati kebabs, fragrant biryani, and crispy basket chaat.",
      vibes: ["street_food"],
      types: ["restaurant", "food"]
    },
    {
      id: "sf_kolkata_04",
      place_id: "sf_kolkata_04",
      name: "Dacres Lane & Park Street Kathi Roll Stalls",
      state: "West Bengal",
      category: "Street Food Trail",
      image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Vibrant",
      rating: 4.90,
      description: "Historic food lane serving authentic Mughlai paratha, crispy egg-chicken kathi rolls, and tangy puchka waters.",
      vibes: ["street_food"],
      types: ["restaurant", "food"]
    },
    {
      id: "sf_ahmedabad_05",
      place_id: "sf_ahmedabad_05",
      name: "Manek Chowk Night Food Bazaar",
      state: "Gujarat",
      category: "Street Food Trail",
      image: "https://images.unsplash.com/photo-1606491956689-2ea866880049?q=80&w=1000&auto=format&fit=crop",
      crowdLevel: "Vibrant",
      rating: 4.87,
      description: "Square that transforms every twilight into a lively street food carnival with gwalior dosa, pav bhaji, and kulfi.",
      vibes: ["street_food"],
      types: ["restaurant", "food"]
    }
  ]
};
