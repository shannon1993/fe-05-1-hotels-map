var app = app || {};

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
    self.yelp = {};

    /**
     * @typedef Hotels
     * @type Object
     * @property {string} name - Name of hotel
     * @property {string} id - Yelp business ID
     * @property {string} twitter - Twitter screen name
     * @property {object} location - Hotel coordinates
     * @property {number} location.lat - Latitude
     * @property {number} location.lng - Longitude
     * @property {number} diamonds - Diamond rating of hotel
     */

    /**
     * Retrieves the hotels json from Firebase server.
     *
     * @function app.Hotel.init
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

        // Start the 10 second timer
        self.reqTimeout();

        hotelsRef = new Firebase('https://crackling-heat-3113.firebaseio.com');

        // Read the data only once
        hotelsRef.once('value', function(dataSnapshot) {

            self.yelp = dataSnapshot.child('yelp').val();

            hotelsJSON = dataSnapshot.child('hotels').val();

            // Store all the hotel data in app.Hotel.hotels
            length = hotelsJSON.length;
            for (i; i < length; i++) {
                hotel = hotelsJSON[i];
                hotel.content = null;
                hotel.tweets = null;

                // Save each hotel into a Knockout Observable Array
                self.hotels.push(hotel);
            }

            // Initialize the map with the hotels
            app.vm.init();

        }, function (errorObject) {
            // Called when client does not have permission to read this data
            // This will ONLY display if Firebase rules for READ is set to FALSE
            var errMsg = 'Error code: ' + errorObject.code + '. <br>';
                errMsg += 'You do not have permission to read hotel data. Please contact the webmaster to gain access.';
            app.vm.dispMsg(errMsg);
        });
    }; // init

    /**
     * Timer that displays an error message if map has not loaded.
     *
     * @function app.Hotel.reqTimeout
     * @memberof app.Hotel
     */
    self.reqTimeout = function () {
        // This will display if client cannot connect to Firebase after 10 seconds
        var errMsg = 'Firebase server request timed out. <br> Check your connection and refresh the page.';
        setTimeout( function() {
            // Check to see if the hotel data is loaded and display error message if no hotels
            if(self.hotels().length === 0) {
                app.vm.timeout(true);
                app.vm.dispMsg(errMsg);
            }
        }, 10000);
    }; // reqTimeout

}; // Hotel
