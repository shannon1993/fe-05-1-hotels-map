/* Las Vegas Diamond Hotels Map
----------------------------------*/

var app = app || {};

app.HotelModel     = app.HotelModel || {};
app.HotelViewModel = app.HotelViewModel || {};
app.HotelView      = app.HotelView || {};
app.MapView        = app.MapView || {};

/**
 * Callback function for Google Maps (see index.html)
 * This will run after the maps api is loaded.
 */
var initApp = function() {
    app.hm  = new app.HotelModel();
    app.hvm = new app.HotelViewModel();
    app.hv  = new app.HotelView();
    app.mv  = new app.MapView();

    app.hm.init();
};


app.HotelModel = function() {
    'use strict';

    var self = this;

    /**
     * @typedef Hotels
     * @type Object
     * @property {string} name - Name of hotel
     * @property {object} location - Latitude/Longitude
     * @property {number} diamonds - Diamond rating of hotel
     */

    /**
     * Retrieves the hotels json from Firebase server
     *
     * @see https://www.firebase.com/docs/web/guide/retrieving-data.html#section-reading-once
     * @return {Hotels} - Hotel data in json notation
     */
    self.init = function() {
        var hotelsRef, hotels;

        hotelsRef = new Firebase('https://crackling-heat-3113.firebaseio.com/hotels');

        // Read the data only once https://www.firebase.com/docs/web/api/query/once.html
        hotelsRef.once('value', function(dataSnapshot) {

        hotels = dataSnapshot.val();

        self.hotels = hotels;

        app.hvm.init();

        }, function (errorObject) {
            // TODO: display error to user
            // TODO: return at least 5 hotels from local file?
            console.log("The read failed: " + errorObject.code);
        });

    };
}; // HotelModel


app.HotelViewModel = function() {
    'use strict';

    var self = this;

    self.init = function() {
        app.mv.initMap();
    };

    self.getHotels = function() {
        return app.hm.hotels;
    };


}; // HotelViewModel


app.HotelView = function() {
    'use strict';

}; // HotelView


app.MapView = function() {
    'use strict';

    var self = this;

    /**
     * Displays a Google Map
     *
     * @see https://developers.google.com/maps/documentation/javascript/reference
     * @param {[type]} [varname] [description] // TODO
     */
    self.initMap = function(data) {
        var mapOptions = {
            disableDefaultUI: true,
            center: {lat: 36.1070161, lng: -115.1798162},
            zoom: 15
            // 1: World
            // 5: Landmass/continent
            // 10: City
            // 15: Streets
            // 20: Buildings
        }; // mapOptions

        //var location = data.location;

        var locationLatLng = {lat: 36.1066653, lng: -115.1790977};


        console.log("-----app.MapView.initMap----");
        var h = app.hvm.getHotels();
        console.dir(h);


        var mapDiv = document.getElementById('map');

        var map = new google.maps.Map(mapDiv, mapOptions);

        var marker = new google.maps.Marker({
            position: locationLatLng,
            map: map,
            title: 'Hello World!'
        }); // marker
    }; // initMap
}; // MapView
