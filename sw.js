// Service worker sederhana — cukup untuk membuat halaman bisa "Ditambahkan ke Layar Utama"
// sebagai aplikasi (tanpa address bar), dan menyimpan file dasar agar tetap bisa
// terbuka meski koneksi internet putus sesaat (data tetap butuh internet untuk sinkron).
const CACHE_NAME = 'cpmi-parco-laut-v1';
const FILES_TO_CACHE = [
  '2_tracking_cpmi.html',
  '4_update_cepat.html',
  'icon-192.png',
  'icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Selalu coba ambil dari internet dulu (data harus terbaru), baru fallback ke cache kalau offline
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
