const CACHE_NAME = 'nyxwave-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/site.css',
    '/index.js',
    'assets/nyxwave-logo-transparent.png',
    'assets/nyxwave-logo-transparentt.png',
    'https://sdk.scdn.co/spotify-player.js', // Se for usar Spotify
    'https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Retorna do cache se disponível
                if (response) {
                    return response;
                }
                // Senão, faz a requisição normal
                return fetch(event.request);
            })
    );
});