/* ============================================================================
   SERVICE WORKER — Groupe Gbêmadoyomin
   ---------------------------------------------------------------------------
   - Cache tous les fichiers statiques pour un fonctionnement 100% hors ligne
   - Stratégie "cache first" pour les ressources locales
   - Stratégie "network first" pour les pages HTML (pour avoir les majs)
   - Fallback automatique vers le cache en cas d'absence de réseau
   ========================================================================== */

const CACHE_NAME = 'gg-cache-v1';
const RUNTIME_CACHE = 'gg-runtime-v1';
const OFFLINE_URL = 'offline.html';

/* ---------------------------------------------------------------------------
   Liste des fichiers essentiels à pré-cacher (app shell)
   ------------------------------------------------------------------------- */
const PRECACHE_URLS = [
  // Pages principales
  'index.html',
  'le-professeur.html',
  'consultations.html',
  'ong.html',
  'boutique.html',
  'evenements.html',
  'vibration-sacree.html',
  'medias.html',
  'decouvrir.html',
  'contact.html',
  'article.html',

  // Manifest et logo
  'manifest.json',
  'logo-gg.jpeg',
  'logo-cabinet.png',
  'logo-ong.png',
  'logo-todaaa.png',
  'logo-vibration.png',

  // Images affiches & livres
  'hero-groupe-bg.jpeg',
  'professeur-portrait.jpeg',
  'professeur-hero.jpeg',
  'affiche-evenement.jpeg',
  'communaute-vs.jpeg',
  'livre-du-fa.jpeg',
  'code-de-vie.jpeg',
  'vodoun-dan.jpeg',
  'livre-astuces.jpeg',
  'wave.jpeg',
  'paypal.jpeg',

  // Favicon (si présent)
  'favicon.ico'
];

/* ---------------------------------------------------------------------------
   Installation : pré-cache des ressources essentielles
   ------------------------------------------------------------------------- */
self.addEventListener('install', (event) => {
  console.log('[SW] Installation…');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pré-cache des ressources');
        // On utilise addAll avec map pour ignorer les erreurs individuelles
        return Promise.all(
          PRECACHE_URLS.map((url) =>
            cache.add(url).catch((err) => {
              console.warn('[SW] Échec pré-cache (ignoré) :', url, err.message);
            })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

/* ---------------------------------------------------------------------------
   Activation : nettoyage des anciens caches
   ------------------------------------------------------------------------- */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation…');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== RUNTIME_CACHE)
          .map((key) => {
            console.log('[SW] Suppression ancien cache :', key);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim())
  );
});

/* ---------------------------------------------------------------------------
   Fetch : interception des requêtes réseau
   ------------------------------------------------------------------------- */
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // On ne gère que les requêtes GET
  if (request.method !== 'GET') return;

  // On ignore les requêtes vers Firebase / analytics / API externes
  const url = new URL(request.url);
  const ignoredHosts = [
    'firebaseio.com',
    'firestore.googleapis.com',
    'google-analytics.com',
    'googletagmanager.com',
    'gstatic.com/firebasejs',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'formsubmit.co',
    'postimages.org',
    'postimg.cc',
    'res.cloudinary.com',
    'imgbb.com',
    'youtube.com',
    'youtu.be'
  ];
  if (ignoredHosts.some((h) => url.hostname.includes(h) || url.pathname.includes(h))) {
    return; // laisse passer normalement (network only)
  }

  // Pour les pages HTML : Network First (pour avoir les dernières versions en ligne)
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // On met à jour le cache avec la version fraiche
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => {
          // En cas de coupure réseau, on sert la version en cache
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            // Sinon page offline personnalisée si présente
            return caches.match(OFFLINE_URL).then((offline) => {
              return offline || new Response(
                '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Hors ligne</title><style>body{background:#0d0d0d;color:#f0ebe0;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;padding:20px}h1{color:#b8922e}</style></head><body><div><h1>📶 Vous êtes hors ligne</h1><p>Vérifiez votre connexion internet puis réessayez.</p><p><a href="/index.html" style="color:#d4af5a;">Retour à l\'accueil</a></p></div></body></html>',
                { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
              );
            });
          });
        })
    );
    return;
  }

  // Pour les autres ressources (CSS, JS, images, fonts) : Cache First
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          // On met en cache uniquement les réponses valides
          if (!response || response.status !== 200 || response.type === 'opaque') {
            return response;
          }
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => {
          // Fallback : image vide ou réponse générique
          if (request.destination === 'image') {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#111" width="200" height="200"/><text x="100" y="105" text-anchor="middle" fill="#7a7060" font-size="14" font-family="sans-serif">Image hors ligne</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          }
          return new Response('', { status: 408, statusText: 'Hors ligne' });
        });
    })
  );
});

/* ---------------------------------------------------------------------------
   Messages (ex: forcer la mise à jour depuis la page)
   ------------------------------------------------------------------------- */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
