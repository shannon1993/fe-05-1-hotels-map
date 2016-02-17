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
 * @memberof app
 */
app.Hotel = function() {
    'use strict';

    var self = this;

    self.hotels = ko.observableArray();

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
     * @memberof app.Hotel
     * @see {@link https://www.firebase.com/docs/web/guide/retrieving-data.html#section-reading-once}
     * @see {@link https://www.firebase.com/docs/web/api/query/once.html}
     * @returns {Hotels} - Hotel data in json notation
     */
    self.init = function() {
        var hotelsRef, hotels;
        var i = 0;
        var hotel = [];
        var length = 0;

        hotelsRef = new Firebase('https://crackling-heat-3113.firebaseio.com/hotels');

        // Read the data only once
        hotelsRef.once('value', function(dataSnapshot) {

            hotels = dataSnapshot.val();

            // Store all the hotel data in app.Hotel.hotels
            length = hotels.length;
            for (i; i < length; i++) {
                hotel = hotels[i];

                // Save each hotel into a Knockout Observable Array
                self.hotels.push(hotel);
            }

            // Initialize the map with the hotels
            app.vm.init();

            // Now activate Knockout bindings on the ViewModel
            ko.applyBindings(app.vm);

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
 * @memberof app
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
 * @memberof app
 */
app.ViewModel = function() {
    'use strict';

    var self = this;

    self.hotelList = ko.observableArray();

    self.getHotels = ko.computed(function() {
        return app.model.hotels();
    });

    self.getHotelsLength = ko.computed(function() {
        return app.model.hotels().length;
    });

    self.init = function() {
        self.hotelList = self.getHotels();
        app.mv.initMap();
    }; // init
}; // ViewModel


/**
 * HotelView
 * @name app.HotelView
 * @class HotelView
 * @memberof app
 */
app.HotelView = function() {
    'use strict';

    var self = this;

}; // HotelView


/**
 * MapView
 * @name app.MapView
 * @class MapView
 * @memberof app
 */
app.MapView = function() {
    'use strict';

    var self = this;

    /**
     * Displays a Google Map
     * @function
     * @name app.MapView.init
     * @memberof app.MapView
     * @see {@link https://developers.google.com/maps/documentation/javascript/reference}
     */
    self.initMap = function() {
        var c = 0;
        var marker = {};
        var hotel = [];
        var place = {};
        var allHotels = app.vm.getHotels();
        var length = app.vm.getHotelsLength();

        self.mapOptions = {
            disableDefaultUI: true,
            center: {lat: 36.1049534, lng: -115.1724043},
            zoom: 15 // 1: World, 5: Landmass/continent, 10: City, 15: Streets, 20: Buildings
        }; // mapOptions

        self.mapDiv = document.getElementById('map');

        // Create the map
        self.map = new google.maps.Map(self.mapDiv, self.mapOptions);

        for (c; c < length; c++) {
            hotel = allHotels[c];

            marker = new google.maps.Marker({
                position: hotel.location,
                map: self.map,
                title: hotel.name
            }); // marker
        }
    }; // initMap

}; // MapView
