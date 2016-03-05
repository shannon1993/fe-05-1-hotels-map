/**
 * Las Vegas Diamond Hotels Map App
 * @namespace {object} app
 */
var app = app || {};


/**
 * Callback for Google Maps. Runs after the maps api is loaded.
 *
 * @function app.init
 * @memberof app
 */
app.init = function() {
    app.model = new app.Hotel();
    app.vm = new app.ViewModel();
    app.hv = new app.HotelView();
    app.mv = new app.MapView();

    // Get the hotel data
    app.model.init();

    // Activate Knockout bindings on the ViewModel
    ko.applyBindings(app.vm);
};


/**
 * Callback for onerror. If a script resource has an error, then a message is displayed.
 *
 * @function app.errorHandler
 * @memberof app
 */
app.errorHandler = function(x) {
    var m = document.getElementById('map');
    m.innerHTML = 'There was an error loading the ' + x + ' script.';
};
