/**
 * Route Optimization Service for Bharat Yatra
 * Handles both structured Gemini activities (with coordinates) and legacy text activities.
 * Uses OSRM Trip API for real road geometry and Haversine TSP fallback.
 */

import { openOfflineDB } from './offlineStorage';

/**
 * Haversine distance formula in kilometers
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Extract place info from activity — handles BOTH structured objects and legacy strings
 */
export function extractPlaceInfo(activity, destination = "Varanasi", index = 0) {
  // Handle structured Gemini activity objects (with lat, lng, openTime, closeTime)
  if (typeof activity === 'object' && activity !== null && activity.lat && activity.lng) {
    return {
      name: activity.name || 'Unknown Place',
      fullText: activity.description || activity.name || '',
      lat: activity.lat,
      lng: activity.lng,
      open: activity.openTime || '06:00',
      close: activity.closeTime || '18:00',
      category: activity.category || 'walk',
      time: activity.time || ''
    };
  }

  // Legacy string activity: "06:00 AM — Visit Kashi Vishwanath Temple"
  const activityText = typeof activity === 'string' ? activity : (activity?.name || activity?.description || String(activity));
  const clean = activityText.replace(/^[\d:apm\s—–-]+/i, '').trim();
  const lower = clean.toLowerCase();

  // Known landmark coordinates for text-based fallback
  const KNOWN = {
    "kashi vishwanath": { lat: 25.3109, lng: 83.0107, open: "03:00", close: "23:00" },
    "dashashwamedh": { lat: 25.3069, lng: 83.0104, open: "05:00", close: "22:00" },
    "ganga aarti": { lat: 25.3069, lng: 83.0104, open: "05:00", close: "22:00" },
    "sarnath": { lat: 25.3811, lng: 83.0214, open: "06:00", close: "17:30" },
    "dhamek stupa": { lat: 25.3809, lng: 83.0245, open: "06:00", close: "18:00" },
    "manikarnika": { lat: 25.3108, lng: 83.0142, open: "00:00", close: "23:59" },
    "assi ghat": { lat: 25.2891, lng: 83.0064, open: "04:30", close: "22:00" },
    "banaras hindu university": { lat: 25.2677, lng: 82.9913, open: "08:00", close: "18:00" },
    "ramnagar fort": { lat: 25.2687, lng: 83.0248, open: "09:30", close: "17:00" },
    "tulsi manas": { lat: 25.2930, lng: 82.9980, open: "05:30", close: "21:00" },
    "sankat mochan": { lat: 25.2818, lng: 82.9987, open: "05:00", close: "22:00" },
    "godowlia": { lat: 25.3100, lng: 83.0050, open: "10:00", close: "22:30" },
    "taj mahal": { lat: 27.1751, lng: 78.0421, open: "06:00", close: "18:30" },
    "agra fort": { lat: 27.1795, lng: 78.0211, open: "06:00", close: "18:00" },
    "red fort": { lat: 28.6562, lng: 77.2410, open: "09:30", close: "17:30" },
    "qutub minar": { lat: 28.5245, lng: 77.1855, open: "07:00", close: "18:00" },
    "humayun": { lat: 28.5878, lng: 77.2507, open: "06:00", close: "18:00" },
    "india gate": { lat: 28.6129, lng: 77.2295, open: "00:00", close: "23:59" },
    "chandni chowk": { lat: 28.6506, lng: 77.2303, open: "10:00", close: "22:00" },
    "amber fort": { lat: 26.9855, lng: 75.8513, open: "08:00", close: "17:30" },
    "hawa mahal": { lat: 26.9239, lng: 75.8267, open: "09:00", close: "17:00" },
    "city palace": { lat: 26.9258, lng: 75.8237, open: "09:30", close: "17:00" },
    "jantar mantar": { lat: 26.9248, lng: 75.8246, open: "09:00", close: "17:00" },
    "nahargarh": { lat: 26.9378, lng: 75.8156, open: "10:00", close: "22:00" },
    "virupaksha": { lat: 15.3350, lng: 76.4600, open: "06:00", close: "18:30" },
    "vittala": { lat: 15.3392, lng: 76.4795, open: "08:30", close: "17:30" },
    "lotus mahal": { lat: 15.3207, lng: 76.4697, open: "08:00", close: "18:00" },
    "matanga": { lat: 15.3314, lng: 76.4665, open: "05:30", close: "19:00" },
    "alleppey": { lat: 9.4981, lng: 76.3388, open: "06:00", close: "18:30" },
    "fort kochi": { lat: 9.9658, lng: 76.2421, open: "00:00", close: "23:59" },
    "munnar": { lat: 10.0889, lng: 77.0595, open: "06:00", close: "18:00" },
  };

  for (const [key, coords] of Object.entries(KNOWN)) {
    if (lower.includes(key) || key.includes(lower)) {
      return {
        name: clean.split('—')[0].split('(')[0].trim(),
        fullText: activityText,
        lat: coords.lat,
        lng: coords.lng,
        open: coords.open,
        close: coords.close
      };
    }
  }

  // Destination-based coordinate fallback
  let baseLat = 25.3176, baseLng = 82.9739;
  const destLower = destination.toLowerCase();
  if (destLower.includes('delhi')) { baseLat = 28.6139; baseLng = 77.2090; }
  else if (destLower.includes('jaipur')) { baseLat = 26.9124; baseLng = 75.7873; }
  else if (destLower.includes('kerala')) { baseLat = 9.9312; baseLng = 76.2673; }
  else if (destLower.includes('hampi')) { baseLat = 15.3350; baseLng = 76.4600; }
  else if (destLower.includes('spiti')) { baseLat = 32.2461; baseLng = 78.0349; }
  else if (destLower.includes('agra')) { baseLat = 27.1767; baseLng = 78.0081; }
  else if (destLower.includes('udaipur')) { baseLat = 24.5854; baseLng = 73.7125; }
  else if (destLower.includes('rishikesh')) { baseLat = 30.0869; baseLng = 78.2676; }
  else if (destLower.includes('goa')) { baseLat = 15.4989; baseLng = 73.8278; }
  else if (destLower.includes('ladakh')) { baseLat = 34.1526; baseLng = 77.5771; }
  else if (destLower.includes('kolkata')) { baseLat = 22.5726; baseLng = 88.3639; }
  else if (destLower.includes('mumbai')) { baseLat = 19.0760; baseLng = 72.8777; }

  const offsets = [
    { dLat: 0, dLng: 0 },
    { dLat: 0.012, dLng: 0.008 },
    { dLat: -0.010, dLng: 0.015 },
    { dLat: 0.020, dLng: -0.012 },
    { dLat: -0.018, dLng: -0.008 }
  ];
  const offset = offsets[index % offsets.length];

  let open = "06:00", close = "18:30";
  if (lower.includes('temple') || lower.includes('ghat') || lower.includes('aarti')) { open = "04:30"; close = "22:00"; }
  else if (lower.includes('fort') || lower.includes('museum') || lower.includes('palace')) { open = "09:00"; close = "17:30"; }
  else if (lower.includes('food') || lower.includes('market') || lower.includes('bazaar')) { open = "10:00"; close = "22:30"; }

  return {
    name: clean.split('—')[0].split('(')[0].trim(),
    fullText: activityText,
    lat: baseLat + offset.dLat,
    lng: baseLng + offset.dLng,
    open,
    close
  };
}

/**
 * Format minutes to human time (e.g. "07:30 AM")
 */
function minutesToTime(totalMinutes) {
  let h = Math.floor(totalMinutes / 60) % 24;
  let m = Math.floor(totalMinutes % 60);
  const ampm = h >= 12 ? 'PM' : 'AM';
  let displayH = h % 12;
  if (displayH === 0) displayH = 12;
  return `${displayH < 10 ? '0' : ''}${displayH}:${m < 10 ? '0' : ''}${m} ${ampm}`;
}

/**
 * Validate open/close status for arrival time
 */
function validateOpenStatus(arrivalMinutes, openStr = "06:00", closeStr = "18:00") {
  const [oh, om] = openStr.split(':').map(Number);
  const [ch, cm] = closeStr.split(':').map(Number);
  const openMins = oh * 60 + (om || 0);
  const closeMins = ch * 60 + (cm || 0);

  if (arrivalMinutes < openMins) {
    return { status: 'opening_later', badge: `Opens in ${openMins - arrivalMinutes}m`, color: 'text-amber-300 bg-amber-500/10 border-amber-500/30', isClosed: false };
  }
  if (arrivalMinutes >= closeMins) {
    return { status: 'closed', badge: 'Closed on arrival', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', suggestion: 'Recommended to visit earlier.', isClosed: true };
  }
  if (closeMins - arrivalMinutes <= 30) {
    return { status: 'closing_soon', badge: 'Closing soon (<30m)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', isClosed: false };
  }
  return { status: 'open', badge: 'Open on arrival', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', isClosed: false };
}

/**
 * Fetch real street roadway geometry from OSRM Route API
 */
async function fetchOsrmRoadwayGeometry(stops = []) {
  if (!stops || stops.length < 2) return [];
  const coordString = stops.map(s => `${s.lng},${s.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson&steps=false`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const json = await res.json();
      if (json.code === 'Ok' && json.routes?.[0]?.geometry?.coordinates) {
        return json.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
      }
    }
  } catch (err) {
    console.warn("OSRM Route geometry fetch failed:", err.message);
  }
  return [];
}

/**
 * Optimize route for day activities
 * Handles both structured Gemini objects and legacy text strings
 */
export async function optimizeDayRoute(activities = [], destination = "Varanasi", dayNumber = 1) {
  if (!activities || activities.length === 0) return null;

  // Extract place info from all activities (handles both formats)
  const rawStops = activities.map((act, idx) => extractPlaceInfo(act, destination, idx));
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  let orderedStops = [...rawStops];
  let totalDistanceKm = 0;
  let totalDurationMins = 0;
  let roadGeometry = [];
  let isOsrmSuccess = false;

  // OSRM Trip optimization if online and 2+ stops
  if (isOnline && rawStops.length > 1) {
    try {
      const coordString = rawStops.map(s => `${s.lng},${s.lat}`).join(';');
      const osrmUrl = `https://router.project-osrm.org/trip/v1/driving/${coordString}?source=first&overview=full&geometries=geojson&steps=false`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(osrmUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.code === 'Ok' && data.waypoints && data.trips?.[0]) {
          const trip = data.trips[0];
          totalDistanceKm = (trip.distance / 1000).toFixed(1);
          totalDurationMins = Math.round(trip.duration / 60);

          if (trip.geometry?.coordinates) {
            roadGeometry = trip.geometry.coordinates.map(c => [c[1], c[0]]);
          }

          const sorted = [...data.waypoints].sort((a, b) => a.waypoint_index - b.waypoint_index);
          orderedStops = sorted.map(wp => rawStops[wp.location_index] || rawStops[wp.waypoint_index]);
          isOsrmSuccess = true;
        }
      }
    } catch (err) {
      console.warn("OSRM Trip API fallback:", err.message);
    }
  }

  // Nearest-Neighbor TSP fallback
  if (!isOsrmSuccess) {
    const unvisited = [...rawStops];
    const sequence = [unvisited.shift()];
    let cumDist = 0;

    while (unvisited.length > 0) {
      const cur = sequence[sequence.length - 1];
      let nearIdx = 0, minDist = Infinity;
      for (let i = 0; i < unvisited.length; i++) {
        const d = calculateHaversineDistance(cur.lat, cur.lng, unvisited[i].lat, unvisited[i].lng);
        if (d < minDist) { minDist = d; nearIdx = i; }
      }
      cumDist += minDist;
      sequence.push(unvisited.splice(nearIdx, 1)[0]);
    }

    orderedStops = sequence;
    totalDistanceKm = cumDist.toFixed(1);
    totalDurationMins = Math.round((cumDist / 25) * 60) + orderedStops.length * 8;

    if (isOnline) {
      roadGeometry = await fetchOsrmRoadwayGeometry(orderedStops);
    }
  }

  // Timeline with opening hours validation
  let currentMinute = 390; // 06:30 AM
  const stopsWithTiming = orderedStops.map((stop, idx) => {
    const legMins = idx === 0 ? 0 : Math.max(12, Math.round(totalDurationMins / Math.max(1, orderedStops.length)));
    currentMinute += legMins;

    const arrivalTime = stop.time || minutesToTime(currentMinute);
    const openCheck = validateOpenStatus(currentMinute, stop.open, stop.close);
    currentMinute += 60;

    return {
      ...stop,
      stopNumber: idx + 1,
      arrivalTime,
      openHours: `${stop.open} – ${stop.close}`,
      statusInfo: openCheck,
      legTravelMins: idx === 0 ? 0 : legMins
    };
  });

  const result = {
    dayNumber,
    destination,
    totalStops: stopsWithTiming.length,
    totalDistance: `${totalDistanceKm} km`,
    totalTravelTime: `${Math.floor(totalDurationMins / 60)}h ${totalDurationMins % 60}m`,
    engine: isOsrmSuccess ? 'OSRM Live Roadway' : 'Smart Route Engine',
    isOnline,
    lastChecked: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    hasClosedStops: stopsWithTiming.some(s => s.statusInfo?.status === 'closed'),
    roadGeometry,
    stops: stopsWithTiming
  };

  // Cache in IndexedDB
  try {
    const db = await openOfflineDB();
    if (db) {
      const tx = db.transaction('trips', 'readwrite');
      tx.objectStore('trips').put({
        id: `route_day${dayNumber}_${destination.toLowerCase().replace(/\s+/g, '_')}`,
        type: 'optimized_day_route',
        dayNumber,
        data: result,
        timestamp: Date.now()
      });
    }
  } catch (e) { /* silent */ }

  return result;
}
