const CACHE = 'timeflow-v1';
const ASSETS = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.filter(a => !a.includes('icon')))));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('/index.html'))));
});

// Push notifications
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title: '⏱ TimeFlow', body: 'Rappel de tracking !' };
  e.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200]
  }));
});

// Scheduled reminder via setTimeout trick
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'REMINDER') {
    self.registration.showNotification('📊 TimeFlow — Rappel', {
      body: "N'oublie pas de tracker tes activités aujourd'hui !",
      icon: '/icon-192.png',
      vibrate: [200, 100, 200]
    });
  }
});
