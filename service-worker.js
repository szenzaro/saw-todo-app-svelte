const CACHE_NAME = 'SAW-Cache';
const STATIC_CACHE_URLS = [
    '/',
    'index.html',
    'icons/icon-192x192.png',
    'icons/icon-256x256.png',
    'icons/icon-384x384.png',
    'icons/icon-512x512.png',
    'vite.svg',

    'src/main.ts',
    'src/app.css',
    'src/firebaseConf.ts',
    'src/lib/TodoItem.svelte',
    'src/dbStore.ts',
    'src/App.svelte',
    'src/LoginForm.svelte',
    'src/Todos.svelte',
    'src/loginStore.ts',
];

self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_CACHE_URLS))
    );
});

self.addEventListener('activate', event => {
    console.log('Service Worker activating.');
});

self.addEventListener('fetch', event => {
    console.log('fetching', event.request.url)
    // Cache-First Strategy
    event.respondWith(
        caches
            .match(event.request) // check if the request has already been cached
            .then(cached => cached || fetch(event.request)) // otherwise request network
    );
});