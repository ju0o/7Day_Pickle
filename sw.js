/**
 * OneWord: Offline Service Worker Caching Engine (v0.8.0)
 * - PWA App Shell Pre-caching
 * - Stale-While-Revalidate strategy for lightning-fast offline startup
 * - Zero external build tool dependency (Pure Vanilla Web Worker)
 */

const CACHE_NAME = "oneword-cache-v0.8.2";

const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./site.webmanifest",
  "./assets/icon.svg",
  "./src/analytics/stats.js",
  "./src/app.js",
  "./src/audio/sound.js",
  "./src/canvas/cardGenerator.js",
  "./src/engine/personas.js",
  "./src/engine/verdict.js",
  "./src/engine/voting.js",
  "./src/fx/particles.js",
  "./src/i18n/translations.js",
  "./src/pwa/installPrompt.js",
  "./src/share/intentShare.js",
  "./src/storage/history.js"
];

// 1. Install Phase: Pre-cache all core application assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    }).catch((err) => {
      console.warn("[ServiceWorker] Pre-cache warning:", err);
    })
  );
});

// 2. Activate Phase: Purge outdated caches and claim clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 3. Fetch Phase: Stale-While-Revalidate with robust offline fallback
self.addEventListener("fetch", (event) => {
  // Only handle HTTP/HTTPS GET requests (skip analytics / chrome-extension)
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed: Return cached version or simple offline text
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.headers.get("accept") && event.request.headers.get("accept").includes("text/html")) {
            return caches.match("./index.html");
          }
          return new Response("Offline — OneWord App Shell is operating offline.", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" }
          });
        });

      return cachedResponse || fetchPromise;
    })
  );
});
