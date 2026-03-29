// Service Worker SANTISYSTEMS v2
// Solo cachea iconos — NUNCA el HTML ni JS
const CACHE = 'santisystems-v2';
const STATIC = ['/icon-192.png', '/icon-512.png', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Borrar caches anteriores
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // NUNCA cachear nada de esto — siempre red fresca
  if (
    url.pathname === '/' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.hostname.includes('workers.dev') ||
    url.hostname.includes('yahoo') ||
    url.hostname.includes('anthropic') ||
    url.hostname.includes('googleapis') ||
    url.hostname.includes('cnn.io') ||
    url.hostname.includes('polymarket') ||
    url.hostname.includes('alphavantage')
  ) {
    e.respondWith(fetch(e.request).catch(() => new Response('Sin conexión', {status:503})));
    return;
  }

  // Solo iconos y manifest van a caché
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
