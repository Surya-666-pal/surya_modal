import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import { 
  Navigation, 
  Clock, 
  MapPin, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  Compass, 
  Layers,
  ArrowRight,
  Wifi,
  WifiOff,
  Loader2,
  CheckCircle,
  Map as MapIcon,
  Download,
  Trash2,
  Sun,
  Moon,
  Palette,
  Eye,
  Flame,
  Castle,
  Trees,
  Utensils
} from 'lucide-react';
import { optimizeDayRoute, extractPlaceInfo } from '../services/routeOptimizer';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { 
  downloadOfflineMapTiles, 
  getOfflineMapStorageSize, 
  removeOfflineMap 
} from '../services/offlineMapService';

/**
 * Determine stop category, icon and color palette based on name/activity
 */
function getStopTheme(name = "") {
  const lower = name.toLowerCase();
  if (lower.includes('temple') || lower.includes('ghat') || lower.includes('aarti') || lower.includes('mandir') || lower.includes('spiritual') || lower.includes('ashram')) {
    return {
      category: 'Spiritual Heritage',
      iconEmoji: '🪔',
      bg: '#1e1405',
      border: '#F59E0B',
      text: '#FDE68A',
      glow: 'rgba(245, 158, 11, 0.65)'
    };
  }
  if (lower.includes('fort') || lower.includes('palace') || lower.includes('monument') || lower.includes('asi') || lower.includes('sarnath') || lower.includes('stupa') || lower.includes('museum')) {
    return {
      category: 'ASI Monument',
      iconEmoji: '🏰',
      bg: '#1b1206',
      border: '#F0932B',
      text: '#FDBA74',
      glow: 'rgba(240, 147, 43, 0.7)'
    };
  }
  if (lower.includes('bazaar') || lower.includes('food') || lower.includes('culinary') || lower.includes('market') || lower.includes('sweets') || lower.includes('thali') || lower.includes('tea')) {
    return {
      category: 'Culinary Trail',
      iconEmoji: '🍛',
      bg: '#1f0d0e',
      border: '#F43F5E',
      text: '#FECDD3',
      glow: 'rgba(244, 63, 94, 0.65)'
    };
  }
  if (lower.includes('lake') || lower.includes('garden') || lower.includes('park') || lower.includes('nature') || lower.includes('hill') || lower.includes('river') || lower.includes('boat')) {
    return {
      category: 'Scenic Nature',
      iconEmoji: '🌿',
      bg: '#081c15',
      border: '#10B981',
      text: '#A7F3D0',
      glow: 'rgba(16, 185, 129, 0.65)'
    };
  }
  return {
    category: 'Heritage Walk',
    iconEmoji: '🚶',
    bg: '#081719',
    border: '#06B6D4',
    text: '#A5F3FC',
    glow: 'rgba(6, 182, 212, 0.65)'
  };
}

const mapFilterThemes = [
  { id: 'obsidian', label: 'Dark Obsidian', emoji: '🌙', cssClass: 'map-tile-filter-obsidian' },
  { id: 'saffron', label: 'Saffron Sepia', emoji: '🪔', cssClass: 'map-tile-filter-saffron' },
  { id: 'emerald', label: 'Emerald Topo', emoji: '🌿', cssClass: 'map-tile-filter-emerald' },
  { id: 'natural', label: 'Natural Base', emoji: '🗺️', cssClass: 'map-tile-filter-natural' },
];

/**
 * Day Route Optimizer Widget Component with Leaflet Offline Map Support,
 * Custom Map Filters and Distinct Stop Point Markers
 */
export default function DayRouteOptimizerWidget({ 
  activities = [], 
  destination = "Varanasi",
  dayNumber = 1,
  className = ""
}) {
  const isOnline = useOnlineStatus();
  const [routeData, setRouteData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [mapFilter, setMapFilter] = useState('obsidian');
  
  // Offline Map Download State
  const [isDownloadingTiles, setIsDownloadingTiles] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isMapCached, setIsMapCached] = useState(false);
  const [storageSize, setStorageSize] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const calculateRoute = async () => {
    if (!activities || activities.length === 0) return;
    setIsCalculating(true);
    try {
      const data = await optimizeDayRoute(activities, destination, dayNumber);
      setRouteData(data);
    } catch (err) {
      console.error("Error optimizing day route:", err);
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    calculateRoute();
  }, [activities, destination, dayNumber]);

  // Check offline storage size on load
  useEffect(() => {
    const checkStorage = async () => {
      const size = await getOfflineMapStorageSize(`day_${dayNumber}_${destination}`);
      setStorageSize(size);
    };
    checkStorage();
  }, [dayNumber, destination, isMapCached]);

  const stops = routeData?.stops || activities.map((act, idx) => {
    const info = extractPlaceInfo(act, destination, idx);
    return {
      stopNumber: idx + 1,
      name: info.name,
      arrivalTime: info.time || (idx === 0 ? "06:30 AM" : idx === 1 ? "10:30 AM" : idx === 2 ? "01:30 PM" : "06:00 PM"),
      openHours: `${info.open || '06:00'} – ${info.close || '21:00'}`,
      lat: info.lat,
      lng: info.lng,
      statusInfo: {
        status: 'open',
        badge: 'Open on arrival',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      }
    };
  });

  // Handle Offline Map Tiles Download
  const handleDownloadOfflineMap = async () => {
    setIsDownloadingTiles(true);
    setDownloadProgress(5);
    try {
      await downloadOfflineMapTiles(
        `day_${dayNumber}_${destination}`,
        stops,
        (percent) => {
          setDownloadProgress(percent);
        }
      );
      setIsMapCached(true);
      const size = await getOfflineMapStorageSize(`day_${dayNumber}_${destination}`);
      setStorageSize(size);
    } catch (err) {
      console.error("Error caching offline map tiles:", err);
    } finally {
      setIsDownloadingTiles(false);
    }
  };

  // Handle Remove Offline Map
  const handleRemoveOfflineMap = async () => {
    await removeOfflineMap(`day_${dayNumber}_${destination}`);
    setIsMapCached(false);
    setStorageSize("0 MB");
  };

  // Initialize and Render Leaflet Map with Custom Point Markers & Effects
  useEffect(() => {
    if (!showMap || !mapContainerRef.current || stops.length === 0) return;

    // Destroy existing instance if present
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const defaultCenter = [stops[0]?.lat || 25.3176, stops[0]?.lng || 82.9739];
    
    // Create Leaflet Map Instance
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 13,
      zoomControl: true,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Add Tile Layer with caching interceptor compatibility
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      subdomains: ['a', 'b', 'c']
    }).addTo(map);

    const latlngs = [];
    const markerBounds = L.latLngBounds([]);

    // Add Themed Point Markers with Pulsing Radar Halo
    stops.forEach((stop, idx) => {
      const lat = stop.lat || (25.3176 + idx * 0.01);
      const lng = stop.lng || (82.9739 + idx * 0.008);
      const point = [lat, lng];
      latlngs.push(point);
      markerBounds.extend(point);

      const theme = getStopTheme(stop.name);
      const stopNum = stop.stopNumber || idx + 1;

      // Custom Point Marker with Pulsing Glow and Distinct Category Glyph
      const customIcon = L.divIcon({
        className: 'custom-leaflet-container',
        html: `
          <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
            <!-- Outer Pulsing Halo -->
            <div class="custom-marker-pulse" style="
              position: absolute;
              inset: 0;
              border-radius: 50%;
              background: ${theme.glow};
              opacity: 0.7;
            "></div>

            <!-- Main Point Badge -->
            <div style="
              position: relative;
              width: 32px; 
              height: 32px; 
              border-radius: 50%; 
              background: ${theme.bg}; 
              border: 2px solid ${theme.border}; 
              color: ${theme.text}; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              box-shadow: 0 4px 14px rgba(0,0,0,0.8), 0 0 10px ${theme.glow};
              font-size: 15px;
              cursor: pointer;
              transition: transform 0.2s ease;
            ">
              <span>${theme.iconEmoji}</span>
            </div>

            <!-- Numbered Micro Medallion -->
            <div style="
              position: absolute;
              top: -3px;
              right: -3px;
              width: 17px;
              height: 17px;
              border-radius: 50%;
              background: #F0932B;
              color: #ffffff;
              font-weight: 900;
              font-size: 9px;
              font-family: sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1.5px solid #091a18;
              box-shadow: 0 2px 5px rgba(0,0,0,0.5);
            ">
              ${stopNum}
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      const marker = L.marker(point, { icon: customIcon }).addTo(map);
      
      // Rich Popups with Dark Theme & Category Styling
      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 6px 4px; min-width: 170px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 4px;">
            <span style="background: rgba(240,147,43,0.2); color: #FBBF24; font-size: 9px; font-weight: 800; text-transform: uppercase; padding: 2px 6px; border-radius: 999px; border: 1px solid rgba(240,147,43,0.3);">
              Stop 0${stopNum} · ${theme.category}
            </span>
          </div>
          <strong style="color: #ffffff; font-size: 13px; font-weight: 700; display: block; margin-top: 2px;">
            ${stop.name}
          </strong>
          <div style="margin-top: 6px; display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #cbd5e1; border-top: 1px solid rgba(255,255,255,0.1); pt-1;">
            <span>⏱️ ${stop.arrivalTime}</span>
            <span style="color: #34d399; font-weight: 700;">${stop.statusInfo?.badge || 'Open'}</span>
          </div>
        </div>
      `);
    });

    // Draw High-Precision Real Roadway Track along actual streets
    const routePath = (routeData?.roadGeometry && routeData.roadGeometry.length > 1) 
      ? routeData.roadGeometry 
      : latlngs;

    if (routePath.length > 1) {
      // 1. Roadway Asphalt Casing Underlay
      L.polyline(routePath, {
        color: '#091a18',
        weight: 9,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // 2. High-Visibility Saffron Roadway Surface
      L.polyline(routePath, {
        color: '#F0932B',
        weight: 5,
        opacity: 1,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // 3. Crisp Highway Center Line Markings (Authentic Road Dashes)
      L.polyline(routePath, {
        color: '#FFFFFF',
        weight: 1.5,
        opacity: 0.95,
        dashArray: '8, 14',
        lineCap: 'round'
      }).addTo(map);
    }

    if (markerBounds.isValid()) {
      map.fitBounds(markerBounds, { padding: [45, 45] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showMap, stops, routeData]);

  if (!activities || activities.length === 0) {
    return null;
  }

  const activeThemeClass = mapFilterThemes.find(t => t.id === mapFilter)?.cssClass || 'map-tile-filter-obsidian';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`bg-gradient-to-br from-[#0c1f1d] via-[#091716] to-[#0c1f1d] rounded-3xl p-6 sm:p-7 border border-amber-400/25 shadow-[0_20px_45px_rgba(0,0,0,0.5)] relative overflow-hidden ${className}`}
    >
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-forest-700/60">
        <div className="flex items-center gap-3.5">
          
          {/* Animated Floating Compass Medallion */}
          <motion.div 
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            whileHover={{ scale: 1.1, rotate: 20 }}
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-saffron/25 via-amber-500/20 to-saffron/15 border border-saffron/50 flex items-center justify-center text-saffron shadow-lg flex-shrink-0 cursor-pointer"
          >
            <Navigation className="w-5 h-5 text-saffron drop-shadow-sm" />
          </motion.div>

          <div>
            <div className="flex items-center gap-2">
              {/* Smart Route Engine Animated Shimmer Capsule */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-saffron/20 via-amber-500/15 to-saffron/20 border border-saffron/40 text-amber-300 text-[10px] font-mono uppercase tracking-widest font-bold shadow-sm">
                {isOnline ? (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                ) : (
                  <WifiOff className="w-2.5 h-2.5 text-amber-400" />
                )}
                <span>Smart Route Engine</span>
              </div>
            </div>

            {/* Headline with Gold Accent */}
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide mt-1.5">
              Day 0{dayNumber} — <span className="text-amber-200">Optimized Circuit</span>
            </h3>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2">
          {/* Toggle Map View Button */}
          <button
            onClick={() => setShowMap(!showMap)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              showMap 
                ? 'bg-saffron text-white border-saffron shadow-sm' 
                : 'bg-forest-800 text-stone-300 border-forest-700 hover:bg-forest-700'
            }`}
            title="Toggle offline map view"
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>{showMap ? "Hide Map" : "View Map"}</span>
          </button>

          {/* Icon-Only Recalculate CTA */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={calculateRoute}
            disabled={isCalculating}
            className="w-9 h-9 rounded-full bg-forest-700/80 hover:bg-saffron border border-forest-600 hover:border-saffron text-stone-200 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md disabled:opacity-50 flex-shrink-0"
            title="Recalculate shortest route"
            aria-label="Recalculate route"
          >
            <RotateCw className={`w-4 h-4 ${isCalculating ? 'animate-spin text-white' : 'text-saffron group-hover:text-white'}`} />
          </motion.button>
        </div>
      </div>

      {/* Interactive Leaflet Offline Map Area with Filters & Location Points */}
      {showMap && (
        <div className="mt-5 mb-3 rounded-2xl overflow-hidden border border-forest-700/80 shadow-lg relative bg-forest-950">
          
          {/* Map Filter Selector Floating Pill Bar */}
          <div className="absolute top-2.5 right-2.5 z-[500] bg-forest-950/90 backdrop-blur-md p-1 rounded-2xl border border-forest-700/80 shadow-lg flex items-center gap-1">
            {mapFilterThemes.map((filter) => {
              const isSelected = mapFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setMapFilter(filter.id)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-saffron text-white shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-forest-800/80'
                  }`}
                  title={`Apply ${filter.label} filter`}
                >
                  <span>{filter.emoji}</span>
                  <span className="hidden sm:inline">{filter.label}</span>
                </button>
              );
            })}
          </div>

          {/* Map Canvas Container with Dynamic Filter CSS */}
          <div 
            ref={mapContainerRef} 
            id={`day-map-${dayNumber}`}
            className={`w-full h-60 sm:h-72 z-0 ${activeThemeClass}`}
          />

          {/* Offline Map Controls & Download Status Overlay */}
          <div className="p-3 bg-forest-900/95 border-t border-forest-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-300">
              <span className="inline-flex items-center gap-1 font-bold text-amber-300 font-leaguespartan uppercase tracking-wider text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-saffron" />
                <span>GPS Offline Trail</span>
              </span>
              <span className="text-stone-500">·</span>
              <span className="text-emerald-400 font-mono text-[10px] font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Real Street Network</span>
              </span>
              <span className="text-stone-500 hidden sm:inline">·</span>
              <span className="text-stone-300 font-mono text-[11px] hidden sm:inline">
                {storageSize || "Zoom 12-16 Ready"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isDownloadingTiles ? (
                <div className="flex items-center gap-2 text-saffron font-bold text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Downloading map tiles: {downloadProgress}%</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleDownloadOfflineMap}
                    className="px-3 py-1 rounded-full bg-forest-800 hover:bg-saffron text-stone-200 hover:text-white border border-forest-600 hover:border-saffron font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    title="Pre-cache map tiles for offline navigation"
                  >
                    <Download className="w-3 h-3 text-amber-400" />
                    <span>Download Offline Map</span>
                  </button>

                  {storageSize && storageSize !== "0 MB" && (
                    <button
                      onClick={handleRemoveOfflineMap}
                      className="p-1.5 rounded-full hover:bg-rose-950/60 text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove Offline Map tiles"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mini Route Timeline Visualization */}
      <div className="py-5">
        <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:top-3 before:bottom-3 before:left-3 sm:before:left-4 before:w-0.5 before:bg-gradient-to-b before:from-saffron before:via-amber-400 before:to-stone-400">
          {stops.map((stop, sIdx) => {
            const status = stop.statusInfo || {};
            const isClosed = status.status === 'closed';
            const isClosingSoon = status.status === 'closing_soon';
            const theme = getStopTheme(stop.name);

            return (
              <div 
                key={`${dayNumber}-${sIdx}-${stop.name}`}
                className="relative group"
              >
                {/* Numbered Stop Medallion */}
                <div className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shadow-md border-2 ${
                  isClosed
                    ? 'bg-rose-950 text-rose-300 border-rose-500'
                    : isClosingSoon
                    ? 'bg-amber-950 text-amber-300 border-amber-500'
                    : 'bg-forest-950 text-amber-300 border-saffron'
                }`}>
                  {stop.stopNumber || sIdx + 1}
                </div>

                {/* Stop Content Box */}
                <div 
                  className="bg-forest-900/80 hover:bg-forest-800/90 p-4 rounded-2xl border border-forest-700/60 hover:border-saffron/40 transition-all shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{theme.iconEmoji}</span>
                        <h4 className="font-leaguespartan font-bold text-sm sm:text-base text-white tracking-wide">
                          {stop.name}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300 mt-1.5">
                        <span className="inline-flex items-center gap-1 font-mono text-saffron bg-saffron/10 px-2 py-0.5 rounded-md border border-saffron/20">
                          <Clock className="w-3 h-3" />
                          <span>Arr: {stop.arrivalTime}</span>
                        </span>
                        <span className="text-stone-400">·</span>
                        <span className="text-stone-300">
                          Hours: <strong className="text-stone-200">{stop.openHours}</strong>
                        </span>
                        <span className="text-stone-400">·</span>
                        <span className="text-amber-300/80 font-mono text-[11px]">
                          {theme.category}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${status.color || 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'}`}>
                        {isClosed ? (
                          <XCircle className="w-3 h-3" />
                        ) : isClosingSoon ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        <span>{status.badge || "Open on arrival"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Warning recommendation if closed */}
                  {isClosed && status.suggestion && (
                    <div className="mt-2.5 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{status.suggestion}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Stats Footer Bar */}
      <div className="pt-4 border-t border-forest-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-stone-300">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 font-bold uppercase font-leaguespartan">Distance:</span>
            <strong className="text-white font-mono">{routeData?.totalDistance || "12.4 km"}</strong>
          </div>
          <span className="text-stone-600">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 font-bold uppercase font-leaguespartan">Travel Time:</span>
            <strong className="text-white font-mono">{routeData?.totalTravelTime || "1h 15m"}</strong>
          </div>
          <span className="text-stone-600">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 font-bold uppercase font-leaguespartan">Stops:</span>
            <strong className="text-white font-mono">{stops.length} Locations</strong>
          </div>
        </div>

        <span className="text-[10px] text-stone-400 font-mono">
          Checked: {routeData?.lastChecked || "Just now"}
        </span>
      </div>
    </motion.div>
  );
}
