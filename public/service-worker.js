// Service Worker simple pour PWA
const CACHE_NAME = 'begue-baara-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Installation
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service Worker installed');
});

// Activation
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

// Fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourne le cache ou fetch la requête
        return response || fetch(event.request);
      }
    )
  );
});