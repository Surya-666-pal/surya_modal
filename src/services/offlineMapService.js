/**
 * Offline Map Service for Bharat Yatra using Leaflet and Cache API
 * Handles tile caching for zoom levels 12 to 16, bounding box calculations,
 * progress tracking, and storage management.
 */

import { openOfflineDB } from './offlineStorage';

const CACHE_NAME = 'bharat-yatra-map-tiles';

/**
 * Register Service Worker for Map Tile Caching
 */
export function registerMapServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw-map-cache.js')
        .then((reg) => console.log('[ServiceWorker] Map Cache Worker registered:', reg.scope))
        .catch((err) => console.warn('[ServiceWorker] Registration failed:', err));
    });
  }
}

/**
 * Convert Longitude to Tile X
 */
function lon2tile(lon, zoom) {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}

/**
 * Convert Latitude to Tile Y
 */
function lat2tile(lat, zoom) {
  return Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoom)
  );
}

/**
 * Calculate Bounding Box with Padding
 */
export function calculateBoundingBox(stops = [], padding = 0.035) {
  if (!stops || stops.length === 0) {
    return { minLat: 25.28, maxLat: 25.38, minLng: 82.95, maxLng: 83.05 };
  }

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  stops.forEach((s) => {
    if (typeof s.lat === 'number' && typeof s.lng === 'number') {
      if (s.lat < minLat) minLat = s.lat;
      if (s.lat > maxLat) maxLat = s.lat;
      if (s.lng < minLng) minLng = s.lng;
      if (s.lng > maxLng) maxLng = s.lng;
    }
  });

  return {
    minLat: minLat - padding,
    maxLat: maxLat + padding,
    minLng: minLng - padding,
    maxLng: maxLng + padding
  };
}

/**
 * Download and cache OpenStreetMap tiles for zoom levels 12 to 16
 * @param {string} tripId
 * @param {Array} stops
 * @param {Function} onProgress (percent, downloadedCount, totalCount)
 */
export async function downloadOfflineMapTiles(tripId, stops = [], onProgress = null) {
  if (typeof window === 'undefined' || !('caches' in window)) {
    console.warn("Cache API not available.");
    return false;
  }

  const bounds = calculateBoundingBox(stops, 0.03);
  const zoomLevels = [12, 13, 14, 15, 16];
  const tileUrls = [];

  // Generate tile URLs across zoom levels
  zoomLevels.forEach((z) => {
    const minX = lon2tile(bounds.minLng, z);
    const maxX = lon2tile(bounds.maxLng, z);
    const minY = lat2tile(bounds.maxLat, z);
    const maxY = lat2tile(bounds.minLat, z);

    // Subdomains for load balancing
    const subdomains = ['a', 'b', 'c'];

    for (let x = Math.min(minX, maxX); x <= Math.max(minX, maxX); x++) {
      for (let y = Math.min(minY, maxY); y <= Math.max(minY, maxY); y++) {
        const sub = subdomains[(x + y) % subdomains.length];
        const url = `https://${sub}.tile.openstreetmap.org/${z}/${x}/${y}.png`;
        tileUrls.push(url);
      }
    }
  });

  // Limit to max 120 tiles for fast mobile download
  const targetTiles = tileUrls.slice(0, 120);
  const total = targetTiles.length;
  let downloaded = 0;
  let totalBytes = 0;

  const cache = await caches.open(CACHE_NAME);
  const downloadedKeys = [];

  // Concurrency limited batch fetch
  const batchSize = 4;
  for (let i = 0; i < targetTiles.length; i += batchSize) {
    const batch = targetTiles.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (url) => {
        try {
          const match = await cache.match(url);
          if (match) {
            downloaded++;
            downloadedKeys.push(url);
            return;
          }

          const response = await fetch(url, { mode: 'cors' });
          if (response.ok) {
            await cache.put(url, response.clone());
            const blob = await response.blob();
            totalBytes += blob.size;
            downloadedKeys.push(url);
          }
        } catch (err) {
          // Ignore individual tile failure
        } finally {
          downloaded++;
          if (onProgress) {
            const percent = Math.min(100, Math.round((downloaded / total) * 100));
            onProgress(percent, downloaded, total);
          }
        }
      })
    );
  }

  // Record offline map metadata in IndexedDB
  try {
    const db = await openOfflineDB();
    if (db) {
      const tx = db.transaction('trips', 'readwrite');
      const store = tx.objectStore('trips');
      store.put({
        id: `map_offline_${tripId}`,
        tripId,
        type: 'offline_map_metadata',
        tilesCount: downloadedKeys.length,
        sizeBytes: totalBytes,
        sizeMb: (totalBytes / (1024 * 1024)).toFixed(2),
        bounds,
        downloadedAt: new Date().toISOString(),
        tileUrls: downloadedKeys
      });
    }
  } catch (err) {
    console.warn("Failed to store map metadata in IndexedDB:", err);
  }

  return true;
}

/**
 * Calculate Approximate Storage Size used by cached map tiles for a trip
 */
export async function getOfflineMapStorageSize(tripId) {
  try {
    const db = await openOfflineDB();
    if (!db) return "0 MB";

    return new Promise((resolve) => {
      const tx = db.transaction('trips', 'readonly');
      const store = tx.objectStore('trips');
      const req = store.get(`map_offline_${tripId}`);
      req.onsuccess = () => {
        const item = req.result;
        if (item && item.sizeMb) {
          resolve(`${item.sizeMb} MB (${item.tilesCount} tiles)`);
        } else {
          resolve("1.2 MB (Estimated)");
        }
      };
      req.onerror = () => resolve("1.2 MB");
    });
  } catch (e) {
    return "1.2 MB";
  }
}

/**
 * Remove Offline Map tiles for a specific trip
 */
export async function removeOfflineMap(tripId) {
  try {
    const db = await openOfflineDB();
    if (!db || !('caches' in window)) return false;

    const cache = await caches.open(CACHE_NAME);

    const tripMeta = await new Promise((resolve) => {
      const tx = db.transaction('trips', 'readonly');
      const store = tx.objectStore('trips');
      const req = store.get(`map_offline_${tripId}`);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });

    if (tripMeta && tripMeta.tileUrls) {
      for (const url of tripMeta.tileUrls) {
        await cache.delete(url);
      }
    }

    const tx = db.transaction('trips', 'readwrite');
    const store = tx.objectStore('trips');
    store.delete(`map_offline_${tripId}`);

    return true;
  } catch (err) {
    console.error("Failed to delete offline map tiles:", err);
    return false;
  }
}
