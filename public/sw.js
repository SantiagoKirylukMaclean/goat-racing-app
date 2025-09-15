const CACHE_NAME = "goat-racing-v1"
const urlsToCache = [
  "/",
  "/standings",
  "/simulate",
  "/timing",
  "/test-config",
  "/parts",
  "/notes",
  "/manifest.json",
  "/icon-192.jpg",
  "/icon-512.jpg",
]

self.addEventListener("install", (event) => {
  self.skipWaiting()
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(fetch(event.request))
    return
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    }),
  )
})

self.addEventListener("activate", (event) => {
  self.clients.claim()
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
