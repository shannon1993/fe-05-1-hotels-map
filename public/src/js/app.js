/**
 * Las Vegas Diamond Hotels Map App
 * @namespace {object} app
 */
var app = app || {};


/**
 * Callback function for Google Maps (see index.html)
 * This will run after the maps api is loaded.
 */
var initApp = function() {
    app.model = new app.Hotel();
    app.vm = new app.ViewModel();
    app.hv = new app.HotelView();
    app.mv = new app.MapView();

    // Get the hotel data
    app.model.init();
};


/**
 * Hotel
 * @name app.Hotel
 * @class Hotel
 * @memberOf app
 */
app.Hotel = function() {
    'use strict';

    var self = this;

    /**
     * @typedef Hotels
     * @type Object
     * @property {string} name - Name of hotel
     * @property {object} location - Hotel coordinates
     * @property {number} location.lat - Latitude
     * @property {number} location.lng - Longitude
     * @property {number} diamonds - Diamond rating of hotel
     */

    /**
     * Retrieves the hotels json from Firebase server
     *
     * @function
     * @name app.Hotel.init
     * @memberOf app.Hotel
     * @see {@link https://www.firebase.com/docs/web/guide/retrieving-data.html#section-reading-once}
     * @see {@link https://www.firebase.com/docs/web/api/query/once.html}
     * @returns {Hotels} - Hotel data in json notation
     */
    self.init = function() {
        var hotelsRef, hotels;

        hotelsRef = new Firebase('https://crackling-heat-3113.firebaseio.com/hotels');

        // Read the data only once
        hotelsRef.once('value', function(dataSnapshot) {

        hotels = dataSnapshot.val();

        // Store all the hotel data in app.Hotel.hotels
        self.hotels = hotels;

        // Initialize the map with the hotels
        app.vm.initMap();

        }, function (errorObject) {
            // TODO: display error to user
            // TODO: return at least 5 hotels from local file?
            console.log("The read failed: " + errorObject.code);
        });

    };
}; // Hotel


/**
 * Place
 * @name app.Place
 * @class Place
 * @memberOf app
 */
app.Place = function(data) {
    this.name = data.name;
    this.location = data.location;
    this.diamonds = data.diamonds;
    this.markerColor = 'red';
    this.markerOptions = {};
}; // Place


/**
 * ViewModel
 * @name app.ViewModel
 * @class ViewModel
 * @memberOf app
 */
app.ViewModel = function() {
    'use strict';

    var self = this;

    self.mapOptions = {
        disableDefaultUI: true,
        center: {lat: 36.1049534, lng: -115.1724043},
        zoom: 14
        // 1: World
        // 5: Landmass/continent
        // 10: City
        // 15: Streets
        // 20: Buildings
    }; // mapOptions

    self.mapDiv = document.getElementById('map');

    self.map = new google.maps.Map(self.mapDiv, self.mapOptions);

    //self.markers = ko.observableArray();

    self.getHotels = function() {
        return app.hm.hotels;
    };

    /**
     * Displays a Google Map
     * @function
     * @name app.MapView.init
     * @memberOf app.MapView
     * @see {@link https://developers.google.com/maps/documentation/javascript/reference}
     */
    self.initMap = function() {
        var i = 0;
        var marker = {};
        var hotel = [];
        var place = {};
        var length = app.model.hotels.length;

        for (i; i < length; i++) {
            hotel = app.model.hotels[i];

            marker = new google.maps.Marker({
                position: hotel.location,
                map: self.map,
                title: hotel.name
            }); // marker
        }

    }; // initMap

}; // ViewModel


/**
 * HotelView
 * @name app.HotelView
 * @class HotelView
 * @memberOf app
 */
app.HotelView = function() {
    'use strict';

    var self = this;

}; // HotelView


/**
 * MapView
 * @name app.MapView
 * @class MapView
 * @memberOf app
 */
app.MapView = function() {
    'use strict';

    var self = this;


}; // MapView
