// Your Service Worker. You can use its instance with the keyword `self`
// Example: self.addEventListener(...)

// Your Service Worker. You can use its instance with the keyword `self`
// Example: self.addEventListener(...)

const appShellCacheName = 'app-shell-v1';
const appShellFilesToCache = [
    '/',
    '/src/assets/css/desktop.css',
    '/src/assets/css/fonts.css',
    '/src/assets/css/mobile.css',
    '/src/assets/css/normalize.css',
    '/src/assets/css/shell.css',
    '/src/assets/fonts/balsamiq-sans-v1-latin-700.woff',
    '/src/assets/js/dexie.min.js',
    '/src/assets/js/fontawesome-pro-5.13.0.min.js',
    '/src/assets/js/lazysizes.min.js',
    '/src/assets/js/trending.js',
    '/src/assets/js/saved.js',
    '/src/assets/js/search.js',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(appShellCacheName)
        .then((cache) => {
            console.log(cache);
            return cache.addAll(appShellFilesToCache);
        })
    );
});

// TODO: 2c - On activation, remove obsolete caches
self.addEventListener('activate', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return false;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      )
    })
  );
});

// TODO: 2d - On intercepted fetch, use the strategy of your choice to respond to requests
self.addEventListener('fetch', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.respondWith(
    caches.open('website').then(cache => {
      return cache.match(event.request).then(response => {
        var fetchPromise = fetch(event.request).then(networkResponse => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        })
        return response || fetchPromise;
      })
    })
  );
});