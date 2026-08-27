/**
 * Bharat Yatra Service Worker for Leaflet Offline Map Tile Caching
 * Intercepts tile requests to OpenStreetMap and serves from Cache API.
 */

const CACHE_NAME = 'bharat-yatra-map-tiles';

// Gray placeholder SVG data URI for offline fallback when tile is uncached
const GRAY_PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" fill="#142624"/>
  <path d="M0 0h256v256H0z" fill="none" stroke="#1d3835" stroke-width="1"/>
  <text x="128" y="132" fill="#38605c" font-size="11" font-family="sans-serif" text-anchor="middle">Offline Map Area</text>
</svg>`;

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Intercept OpenStreetMap tile requests
  if (url.includes('tile.openstreetmap.org') || url.includes('.tile.osm.org')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // If online, fetch from network and cache
        if (navigator.onLine) {
          try {
            const networkResponse = await fetch(event.request, { mode: 'cors' });
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          } catch (err) {
            // Network failed despite onLine
          }
        }

        // Fallback for offline uncached tiles
        return new Response(GRAY_PLACEHOLDER_SVG, {
          headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store' }
        });
      })
    );
  }
});
