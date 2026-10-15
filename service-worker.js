// ============================================================
// Service Worker — Groupe Gbêmadoyomin
// PWA : cache-first pour les images, network-first pour les pages
// ============================================================

const CACHE_VERSION = 'gg-v1';
const CACHE_STATIC = CACHE_VERSION + '-static';
const CACHE_IMAGES = CACHE_VERSION + '-images';
const CACHE_PAGES = CACHE_VERSION + '-pages';

// Fichiers à mettre en cache dès l'installation
const URLS_STATIC = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/site.webmanifest',
  '/robots.txt',
  '/favicon.ico',
  '/logo-gg.jpeg',
  '/professeur-portrait.jpeg'
];

// Installation : on précharge les fichiers statiques
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      return cache.addAll(URLS_STATIC).catch((err) => {
        console.warn('SW: certains fichiers statiques n\'ont pas pu être mis en cache', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((noms) => {
      return Promise.all(
        noms.filter((nom) => !nom.startsWith(CACHE_VERSION))
            .map((nom) => caches.delete(nom))
      );
    }).then(() => self.clients.claim())
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // On ne gère que le même domaine
  if (url.origin !== location.origin) return;

  // On ignore les requêtes non GET
  if (req.method !== 'GET') return;

  // On ignore Firebase, Google Analytics, Cloudinary, iframes
  if (
    url.hostname.includes('firebase') ||
    url.hostname.includes('google-analytics') ||
    url.hostname.includes('googletagmanager') ||
    url.hostname.includes('cloudinary') ||
    url.hostname.includes('youtube') ||
    url.hostname.includes('tiktok') ||
    url.hostname.includes('facebook')
  ) return;

  // Images : cache-first
  if (req.destination === 'image' || /\.(jpg|jpeg|png|webp|gif|svg|ico)$/i.test(url.pathname)) {
    event.respondWith(
      caches.open(CACHE_IMAGES).then((cache) => {
        return cache.match(req).then((cacheResponse) => {
          if (cacheResponse) return cacheResponse;
          return fetch(req).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(req, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cacheResponse);
        });
      })
    );
    return;
  }

  // Pages HTML : network-first avec fallback cache
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_PAGES).then((cache) => cache.put(req, copy));
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(req).then((cacheResponse) => {
          if (cacheResponse) return cacheResponse;
          return caches.match('/offline.html');
        });
      })
    );
    return;
  }

  // Autres ressources (CSS, JS, fonts) : cache-first
  event.respondWith(
    caches.match(req).then((cacheResponse) => {
      if (cacheResponse) return cacheResponse;
      return fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_STATIC).then((cache) => cache.put(req, copy));
        }
        return networkResponse;
      });
    })
  );
});

// Message du client (utile pour forcer une mise à jour)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
