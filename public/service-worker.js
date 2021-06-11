const staticCache = "static-cache_v1";
const dynamicCache = "dynamic-cache_v1";
const cacheFiles = [
    '/',
    '/index.html',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/styles.css',
    '/manifest.webmanifest',
    '/index.js',
    '/registerserviceworker.js'
];


self.addEventListener('install',event=>{
    event.waitUntil(
        caches.open(staticCache).then(
            cache => cache.addAll(cacheFiles)
        )
    );
    self.skipWaiting();
});

self.addEventListener('activate',event=>{
    event.waitUntil(
        caches.keys().then (keyList =>{
            return Promise.all(
                keyList.map(key=>{
                    if(key !== staticCache &&  key !== dynamicCache){
                        return caches.delete(key);
                    }
                })
            );    
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch',event=>{
    if( event.request.url.includes('/api')){
        event.respondWith(
            caches.open(dynamicCache).then(cache=>{
                return fetch(event.request).then(res=>{
                    if(res.status===200){
                        cache.put(event.request.url,res.clone());
                        return res;
                    }
                }).catch(err=>cache.match(event.request));
            }).catch(console.error)
        );
        return;
    }
    event.respondWith(
        caches.match(event.request).then(res=>res || fetch(event.request))
    );
    
});

