/**
 * Common database helper functions.
 */
class DBHelper {

    /**
     * Registering the Service Worker
     */
    static registerSW() {
        //checking to see if the browser supports sw
        if (!navigator.serviceWorker || !navigator.serviceWorker.register) {
            console.log("This browser doesn't support service workers");
            return;
        }

        //registering the sw
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/sw.js').then(function (registration) {
                // Registration successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function (err) {
                // registration failed
                console.log('ServiceWorker registration failed: ', err);
            });
        });

    };

    /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */
    static get DATABASE_URL() {
        const port = 1337; //get json from remote server
        return `http://localhost:${port}/restaurants`;
    }

    /**
     * Fetch all restaurants.
     */
    static fetchRestaurants(callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', DBHelper.DATABASE_URL);
        xhr.onload = () => {
            if (xhr.status === 200) { // Got a success response from server!
                const restaurants = JSON.parse(xhr.responseText);
                callback(null, restaurants);
            } else { // Oops!. Got an error from server.
                const error = (`Request failed. Returned status of ${xhr.status}`);
                callback(error, null);
            }
        };
        xhr.send();
    }

    /**
     * Fetch a restaurant by its ID.
     */
    static fetchRestaurantById(id, callback) {
        // fetch all restaurants with proper error handling.
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                const restaurant = restaurants.find(r => r.id == id);
                if (restaurant) { // Got the restaurant
                    callback(null, restaurant);
                } else { // Restaurant does not exist in the database
                    callback('Restaurant does not exist', null);
                }
            }
        });
    }

    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */
    static fetchRestaurantByCuisine(cuisine, callback) {
        // Fetch all restaurants  with proper error handling
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given cuisine type
                const results = restaurants.filter(r => r.cuisine_type == cuisine);
                callback(null, results);
            }
        });
    }

    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */
    static fetchRestaurantByNeighborhood(neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given neighborhood
                const results = restaurants.filter(r => r.neighborhood == neighborhood);
                callback(null, results);
            }
        });
    }

    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */
    static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                let results = restaurants
                if (cuisine != 'all') { // filter by cuisine
                    results = results.filter(r => r.cuisine_type == cuisine);
                }
                if (neighborhood != 'all') { // filter by neighborhood
                    results = results.filter(r => r.neighborhood == neighborhood);
                }
                callback(null, results);
            }
        });
    }

    /**
     * Fetch all neighborhoods with proper error handling.
     */
    static fetchNeighborhoods(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all neighborhoods from all restaurants
                const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
                // Remove duplicates from neighborhoods
                const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
                callback(null, uniqueNeighborhoods);
            }
        });
    }

    /**
     * Fetch all cuisines with proper error handling.
     */
    static fetchCuisines(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all cuisines from all restaurants
                const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
                // Remove duplicates from cuisines
                const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
                callback(null, uniqueCuisines);
            }
        });
    }

    /**
     * Restaurant page URL.
     */
    static urlForRestaurant(restaurant) {
        return (`./restaurant.html?id=${restaurant.id}`);
    }

    /**
     * Restaurant image URL.
     */
    static imageUrlForRestaurant(restaurant) {
        /*
        In order to prevent missing photos like for example the Casa Enrique restaurant
        we check to see if we have an image id available...
         */
        if (restaurant.photograph !== undefined) {
            return (`/img/${restaurant.photograph}.jpg`);
        }

        /* In case we do not have an image we could either return null or a dummy photo */
        return 'https://dummyimage.com/776x582/ffffff/000000.jpg&text=No+photo';
    }

    /**
     *
     * a11y - Meaningful alternative text for images
     *
     * @param restaurant
     * @returns {*}
     */
    static imageAltForRestaurant(restaurant) {
        if (restaurant.name !== undefined && restaurant.neighborhood !== undefined) {
            //Alt would sound like "Restaurant Name" in "Location"
            return `Image of ${restaurant.name} restaurant`;
        }
        return null;
    }


    /**
     * Map marker for a restaurant.
     */
    static mapMarkerForRestaurant(restaurant, map) {
        if (typeof google !== "undefined") {

            const marker = new google.maps.Marker({
                    position: restaurant.latlng,
                    title: restaurant.name,
                    url: DBHelper.urlForRestaurant(restaurant),
                    map: map,
                    animation: google.maps.Animation.DROP
                }
            );
            return marker;
        }
    }

}
