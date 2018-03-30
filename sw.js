/**
 *
 * Project: mws-restaurant-stage-1
 * Generated: 30-03-2018 @ 5:03 PM
 *
 * Created by:  Mr. FÜLÖP
 * Email:       online@promoters.ro
 * Web:         https://promoters.online/
 */

// This file must be in /

/**
 * Service Worker actions
 */

let cacheName = 'gglnd-stage1-v0';

let urlsToCache = [
    '/',
    '/favicon.ico',
    '/fonts/raleway-v12-latin-regular.woff2',
    /* TODO  todo change in production */
    '/css/styles.min.css',
    '/css/src/styles.css', //fallback - if one does not run grunt
    '/css/large-screen.css',
    '/css/medium-screen.css',
    '/js/dbhelper.js', //we can compress JS too with grunt - not for now...
    '/js/main.js',
    '/js/restaurant_info.js',
    '/data/restaurants.json',
    '/restaurant.html' //for restaurant details ;)
];


self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(urlsToCache);
        }).catch(function () {
            console.log('Failed to create the cache db.');
        })
    );
});


self.addEventListener('fetch', function (event) {
    event.respondWith(
        //I need to match the cache for restaurants.html?id=
        caches.match(event.request, {ignoreSearch: true})
            .then(function (response) {
                // we have cached data - we return the response
                if (response) {
                    return response;
                }

                /* !! Note for myself:
                Clone the response. A response is a stream
                and because we want the browser to consume the response
                as well as the cache consuming the response, we need
                to clone it so we have two streams.
                */
                let fetchRequest = event.request.clone(); //!!CLONE

                //console.log(fetchRequest); //debug

                return fetch(fetchRequest).then(
                    function (response) {
                        // If we received a valid response from the network
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        let responseToCache = response.clone();

                        caches.open(cacheName)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                ).catch(function (err) {
                    console.log('You are offline!');
                });
            })
    );
});



