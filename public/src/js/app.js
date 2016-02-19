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

    self.slide = document.getElementById('slide');
    self.animateIn = 'animated slideInLeft no-overlay';
    self.animateOut = 'animated fadeOutLeft overlay';
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

    self.slideInLeft = function() {
        slide.className = self.animateIn;
        google.maps.event.trigger(app.mv.map,'resize');

    };

    self.slideOutLeft = function() {
        slide.className = self.animateOut;
        google.maps.event.trigger(app.mv.map,'resize');
    };

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

    // Source: https://sites.google.com/site/gmapsdevelopment/
    self.markerUrl = 'http://maps.google.com/mapfiles/ms/icons/';
    self.markerColors = ['0', '1', 'blue', 'green', 'yellow', 'red'];
    self.infoWindow = null;
    self.currMarker = null;
    self.infoWindow = null;

    /**
     * Displays a Google Map
     * @function
     * @name app.MapView.init
     * @memberof app.MapView
     * @see {@link https://developers.google.com/maps/documentation/javascript/reference}
     */
    self.initMap = function() {
        self.currentMapCenter = null;
        self.originalMapCenter = {lat: 36.1049534, lng: -115.1724043};

        self.mapOptions = {
            disableDefaultUI: true,
            center: self.originalMapCenter,
            zoom: 15 // 1: World, 5: Landmass/continent, 10: City, 15: Streets, 20: Buildings
        }; // mapOptions

        self.mapDiv = document.getElementById('map');

        // Create the map
        self.map = new google.maps.Map(self.mapDiv, self.mapOptions);

        // Create the info window that will be re-used by each marker
        self.infoWindow = new google.maps.InfoWindow();

        // Create the markers
        self.initMarkers();

        // Trigger map resize if the window changes size
        google.maps.event.addDomListener(window, "resize", function() {
            google.maps.event.trigger(self.map, "resize");
        });

        google.maps.event.addListener(self.map, 'resize', function () {
            self.currentMapCenter = self.map.getCenter();
            self.map.setCenter(self.currentMapCenter);
        });


    }; // initMap

    self.initMarkers = function() {
        var b = 0;
        var c = '';
        var marker = {};
        var hotel = [];
        var place = {};
        var allHotels = app.vm.getHotels();
        var length = app.vm.getHotelsLength();

        for (b; b < length; b++) {
            hotel = allHotels[b];

            // Marker color corresponds to diamond rating
            c = self.markerUrl + self.markerColors[hotel.diamonds];

            // Add hotel markers to the map
            marker = new google.maps.Marker({
                map: self.map,
                position: hotel.location,
                title: hotel.name,
                animation: null,
                icon:  c + '.png'
            }); // marker

            // Create an info window when a marker is clicked
            self.createInfoWin(hotel.name,
                               hotel.location.lat,
                               hotel.location.lng,
                               marker,
                               c);
        } // for

        google.maps.event.addListener(self.infoWindow, 'domready', function(){
            //TODO: load yelp info here
            console.log('domready');
            //code to dynamically load new content to infowindow
            //for example:
            //    var existing_content = referenceToInfoWindow.getContent();
            //    var new_content = "...";
            //    referenceToInfoWindow.setContent(existing_content + new_content);
        });


        // window.mapBounds.extend(new google.maps.LatLng(hotel.location.lat, hotel.location.lng));
        // self.map.fitBounds(window.mapBounds);
        // self.map.setCenter(window.mapBounds.getCenter());

        // window.mapBounds = new google.maps.LatLngBounds();

        // window.addEventListener('resize', function(e) {
        //   self.map.fitBounds(mapBounds);
        // });
    }; // initMarkers

    self.createInfoWin = function(name, lat, lng, marker, color) {
        // Open the infoWindow when a marker is clicked
        google.maps.event.addListener(marker, 'click', function() {

            // Set the content
            self.infoWindow.setContent(name);

            self.infoWindow.open(self.map, marker);

            // Animated and change display of marker
                marker.setAnimation(google.maps.Animation.BOUNCE);

            // Display the dot version of the marker
                marker.icon = color + '-dot.png';

            // Animate the marker for 2.1 seconds
            setTimeout(function() {
                marker.setAnimation(null);
                marker.icon = color + '.png';
            }, 2100);
        });
    }; // createInfoWin

}; // MapView
