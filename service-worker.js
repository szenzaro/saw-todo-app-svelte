const CACHE_NAME = 'SAW-Cache-v1';
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
    // Clear obsolete caches
    event.waitUntil(
        caches
            .keys()
            .then(keys => keys.filter(key => key !== CACHE_NAME))
            .then(keys => Promise.all(keys.map(key => caches.delete(key))))
    );
});

self.addEventListener('fetch', event => {
    console.log('fetching', event.request.url)

    // self.clients.matchAll().then(clients => {
    //     clients.forEach(client => {
    //         console.log('posting message')
    //         client.postMessage(
    //             JSON.stringify({
    //                 type: 'notification test',
    //                 data: event.request.url,
    //             })
    //         );
    //     });
    // });

    if (event.request.url.includes('/api/v1/todos')) {
        // response to API requests, Cache Update Refresh strategy
        event.respondWith(caches.match(event.request));
        event.waitUntil(updateCache(event.request).then(notifyClients));
    } else {

        // Cache-First Strategy
        event.respondWith(
            caches
                .match(event.request) // check if the request has already been cached
                .then(cached => cached || fetch(event.request)) // otherwise request network
        );
    }
});

function updateCache(request) {
    return fetch(request.url).then(
        response =>
            caches.open(CACHE_NAME)
                .then(cache => cache.put(request, response.clone())) // we can put response in cache
                .then(() => response) // resolve promise with the Response object
    );
}

function notifyClients(response) {
    return response
        .json()
        .then(resp => {
            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    // report and send new data to client
                    client.postMessage(
                        JSON.stringify({
                            type: response.url,
                            data: resp.data
                        })
                    );
                });
            });
            return resp.data;
        });
}
