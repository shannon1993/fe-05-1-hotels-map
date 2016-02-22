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

    // Init Hotel View click event listeners
    app.hv.init();

    // Activate Knockout bindings on the ViewModel
    ko.applyBindings(app.vm);
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
        var hotelsRef;
        var hotelsJSON;
        var i = 0;
        var hotel = [];
        var length = 0;

        hotelsRef = new Firebase('https://crackling-heat-3113.firebaseio.com/hotels');

        // Read the data only once
        hotelsRef.once('value', function(dataSnapshot) {

            hotelsJSON = dataSnapshot.val();

            // Store all the hotel data in app.Hotel.hotels
            length = hotelsJSON.length;
            for (i; i < length; i++) {
                hotel = hotelsJSON[i];

                // Save each hotel into a Knockout Observable Array
                self.hotels.push(hotel);
            }

            // Initialize the map with the hotels
            app.vm.init();

        }, function (errorObject) {
            // TODO: display error to user
            // TODO: return at least 5 hotels from local file?
            console.log("The read failed: " + errorObject.code);
            self.hotels.push({"hotels": [{"name": "Could not load hotel list. Try again later."}]} );
        });

    };
}; // Hotel


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
    self.filterList = ko.observableArray();
    self.filterText = ko.observable('');
    self.ratingsChecked = ko.observableArray();
    self.ratings = ko.observableArray([
        {ratingValue: 5, icon: 'aaaaa'},
        {ratingValue: 4, icon: 'aaaa'},
        {ratingValue: 3, icon: 'aaa'},
        {ratingValue: 2, icon: 'aa'},
    ]);

    self.nameSort = function(left, right) {
        return left.name == right.name ? 0 : (left.name < right.name ? -1 : 1);
    };

    self.getHotels = ko.computed(function() {
        // Unwrap the observable to return an array
        var hotelArray = app.model.hotels();

        // Sort the array by hotel name
        hotelArray.sort(self.nameSort);

        return hotelArray;
    });

    self.getHotelsLength = ko.computed(function() {
        return app.model.hotels().length;
    });

    self.init = function() {
        self.hotelList(self.getHotels());
        app.mv.initMap();
    };

    self.slideIn = function() {
        app.hv.slideInLeft();
        google.maps.event.trigger(app.mv.map,'resize');
    };

    self.slideOut = function() {
        app.hv.slideOutLeft();
        google.maps.event.trigger(app.mv.map,'resize');
    };

    self.noEnter = function(data, event) {
        // Prevent form submission
        return false;
    };

    self.gotoHotel = function(hotel) {
        // Re-center the map on the marker that was clicked
        app.mv.map.setCenter(hotel.location);

        app.mv.activateMarker(hotel);
    };

    self.filterRatings = function(data, event) {
        self.hotelDisplay();

        // Return true to toggle checkbox
        return true;
    };

    self.ratingsMatch = function(rlength, diamond) {
        var ratings = self.ratingsChecked();
        var d = 0;
        var found = false;
        for(d; d < rlength; d++) {
            if(diamond === ratings[d]) {
                found = true;
                break;
            }
        }

        return found;
    };

    self.hotelDisplay = ko.computed(function() {
        var result = -1;
        var temp = [];
        var query = self.filterText().toLowerCase();
        var rlength = self.ratingsChecked().length;
        var diamond = 0;
        var match = false;

        // Copy the original hotel list array
        self.filterList(self.getHotels());

        if (!query && rlength <= 0) {
            // Return all the hotels
            return self.filterList;
        } else {
            self.filterList().forEach(function(hotel, index) {
                // Check if the query matches with the hotel name
                result = hotel.name.toLowerCase().indexOf(query);
                diamond = hotel.diamonds;

                // Ratings check
                if(rlength > 0)
                    match = self.ratingsMatch(rlength, diamond);
                else
                    match = true;

                if(result >= 0 && match) {
                    hotel.marker.setVisible(true);
                    temp.push(hotel);
                } else {
                    hotel.marker.setVisible(false);
                    app.mv.infoWindow.close();
                }
            }); // forEach

            // Save the filtered hotels back to the ko observable array
            self.filterList(temp);

            return self.filterList;
        } // else
    }); // filterText

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

    self.slide = document.getElementById('slide');
    self.animateIn = 'animated slideInLeft no-overlay';
    self.animateOut = 'animated fadeOutLeft overlay';
    self.h3 = document.getElementsByTagName('h3');

    self.slideInLeft = function() {
        slide.className = self.animateIn;
    };

    self.slideOutLeft = function() {
        slide.className = self.animateOut;
    };

    self.toggleDisplay = function(headElem, iconClass) {
        if (iconClass != 'icons icon-down') {
            iconClass  = 'icons icon-down';

            // Show the section under the heading
            headElem.nextElementSibling.style.display = 'block';
        } else {
            iconClass = 'icons icon-right';

            // Hide the section under the heading
            headElem.nextElementSibling.style.display = 'none';
        }

        return iconClass;
    };

    self.setIcon = function(e) {
        e.target.firstChild.className = self.toggleDisplay(e.target, e.target.firstChild.className);
    };

    self.init = function() {
        var i = 0;
        var len = self.h3.length;

        for(i; i < len; i++) {
            // Add a click event for each h3 heading
            self.h3[i].addEventListener('click', self.setIcon, false);
        } // for
    };

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

    self.infoWindow = null;
    self.currentMapCenter = null;
    self.originalMapCenter = {lat: 36.1049534, lng: -115.1724043};
    self.mapDiv = document.getElementById('map');
    self.mapOptions = {
        disableDefaultUI: true,
        center: self.originalMapCenter,
        zoom: 15,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        }
    };

    // Source: https://sites.google.com/site/gmapsdevelopment/
    self.markerUrl = 'http://maps.google.com/mapfiles/ms/icons/';
    self.markerColors = ['pink', 'purple', 'blue', 'green', 'yellow', 'red'];

    /**
     * Displays a Google Map
     * @function
     * @name app.MapView.init
     * @memberof app.MapView
     * @see {@link https://developers.google.com/maps/documentation/javascript/reference}
     */
    self.initMap = function() {
        // Create the map
        self.map = new google.maps.Map(self.mapDiv, self.mapOptions);

        // Create the info window that will be re-used by each marker
        self.infoWindow = new google.maps.InfoWindow();

        // Create the markers
        self.createMarkers();

        // Trigger map resize if the window changes size
        google.maps.event.addDomListener(window, 'resize', function() {
            google.maps.event.trigger(self.map, 'resize');
        });

        // Update center of the map on resize
        google.maps.event.addListener(self.map, 'resize', function () {
            self.currentMapCenter = self.map.getCenter();
            self.map.setCenter(self.currentMapCenter);
        });
    }; // initMap

    self.createMarkers = function() {
        var c = 0;
        var hotel = {};
        var allHotels = app.vm.getHotels();
        var length = app.vm.getHotelsLength();

        for (c; c < length; c++) {
            hotel = allHotels[c];

            // Marker color corresponds to diamond rating
            hotel.color = self.markerColors[hotel.diamonds];

            // Add hotel markers to the map
            hotel.marker = new google.maps.Marker({
                map: self.map,
                position: hotel.location,
                title: hotel.name,
                animation: null,
                visible: true,
                icon:  self.markerUrl + hotel.color + '.png'
            }); // marker

            // Open an info window when a marker is clicked
            self.setInfoWin(hotel);
        } // for
    }; // createMarkers

    self.setInfoWin = function(hotel) {

        // Open the infoWindow when a marker is clicked
        google.maps.event.addListener(hotel.marker, 'click', function() {
            self.activateMarker(hotel);
        });

    }; // setInfoWin

    self.activateMarker = function(hotel) {
        // Set the content
        self.infoWindow.setContent(hotel.name);

        self.infoWindow.open(self.map, hotel.marker);

        // Animate the marker
        hotel.marker.setAnimation(google.maps.Animation.BOUNCE);

        // Display the dot version of the marker
        hotel.marker.icon = self.markerUrl + hotel.color + '-dot.png';

        // Animate the marker for 2.1 seconds
        setTimeout(function() {
            hotel.marker.setAnimation(null);
            hotel.marker.icon = self.markerUrl + hotel.color + '.png';
        }, 2100);
    }; // activateMarker

}; // MapView
