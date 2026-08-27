/**
 * Hours Validator Service for Bharat Yatra AI Trip Planner (Step 8)
 * Validates opening/closing hours against sequential arrival times.
 * Formats time progression and assigns status badges (Open / Closing soon / Closed).
 */

/**
 * Convert minutes from midnight (e.g. 360 -> "06:00 AM")
 */
export function minutesToTime(totalMinutes) {
  let h = Math.floor(totalMinutes / 60) % 24;
  let m = Math.floor(totalMinutes % 60);
  const ampm = h >= 12 ? 'PM' : 'AM';
  let displayH = h % 12;
  if (displayH === 0) displayH = 12;
  const strM = m < 10 ? `0${m}` : `${m}`;
  const strH = displayH < 10 ? `0${displayH}` : `${displayH}`;
  return `${strH}:${strM} ${ampm}`;
}

/**
 * Parse time string (e.g. "06:00" or "06:00 AM" or "18:30") to minutes from midnight
 */
export function timeStringToMinutes(timeStr) {
  if (!timeStr) return 360; // default 06:00 AM
  const clean = timeStr.trim().toLowerCase();

  const isPM = clean.includes('pm');
  const isAM = clean.includes('am');
  const parts = clean.replace(/[^\d:]/g, '').split(':');
  
  let h = parseInt(parts[0], 10) || 6;
  let m = parseInt(parts[1] || '0', 10);

  if (isPM && h < 12) h += 12;
  if (isAM && h === 12) h = 0;

  return h * 60 + m;
}

/**
 * Validate open/closed status at a given arrival time
 */
export function validateStopTiming(arrivalMinutes, openStr = "06:00", closeStr = "21:00") {
  const openMins = timeStringToMinutes(openStr);
  const closeMins = timeStringToMinutes(closeStr);

  if (arrivalMinutes < openMins) {
    const diff = openMins - arrivalMinutes;
    return {
      status: 'opening_later',
      badge: `Opens in ${diff}m`,
      color: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
      isClosed: false,
      suggestion: `Morning tip: Gates open at ${openStr}. Enjoy a sunrise tea walk nearby while waiting.`
    };
  }

  if (arrivalMinutes >= closeMins) {
    return {
      status: 'closed',
      badge: 'Closed on arrival',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      isClosed: true,
      suggestion: `Alert: Closes at ${closeStr}. Recommended to visit earlier in the morning slot.`
    };
  }

  if (closeMins - arrivalMinutes <= 45) {
    return {
      status: 'closing_soon',
      badge: 'Closing soon (<45m)',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      isClosed: false,
      suggestion: `Tip: Ticket counters close 30m before closing (${closeStr}). Proceed directly to entry.`
    };
  }

  return {
    status: 'open',
    badge: 'Open on arrival',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    isClosed: false
  };
}

/**
 * Step 8: Validate hours and assign arrival timeline for an array of ordered stops
 * @param {Array} orderedStops - Stops sorted by route optimizer
 * @param {number} dayNumber - Current day index (1-based)
 * @param {number} totalDurationMins - Estimated travel duration in minutes
 * @returns {Array} Enriched stops with verified timings and status
 */
export function validateDaySchedule(orderedStops = [], dayNumber = 1, totalDurationMins = 90) {
  let currentMinute = 390; // Start day at 06:30 AM (390 mins)

  const validatedStops = orderedStops.map((stop, idx) => {
    const legTravelMins = idx === 0 ? 0 : Math.max(15, Math.round(totalDurationMins / Math.max(1, orderedStops.length)));
    currentMinute += legTravelMins;

    const arrivalTime = minutesToTime(currentMinute);
    const openTime = stop.openTime || stop.open || "06:00";
    const closeTime = stop.closeTime || stop.close || "21:00";

    const statusInfo = validateStopTiming(currentMinute, openTime, closeTime);
    
    // Average dwell time: 60-75 mins per attraction
    currentMinute += 70;

    return {
      ...stop,
      stopNumber: idx + 1,
      arrivalTime,
      openHours: `${openTime} – ${closeTime}`,
      statusInfo,
      legTravelMins: idx === 0 ? 0 : legTravelMins
    };
  });

  return validatedStops;
}
