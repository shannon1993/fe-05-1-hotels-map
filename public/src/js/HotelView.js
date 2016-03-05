var app = app || {};

/**
 * HotelView
 * @name app.HotelView
 * @class HotelView
 * @memberof app
 */
app.HotelView = function() {
    'use strict';

    var self = this;

    self.animateIn = 'animated slideInLeft no-overlay';
    self.animateOut = 'animated fadeOutLeft overlay';

    /**
     * Updates the class property to slide the menu in.
     *
     * @function app.HotelView.slideInLeft
     * @memberof app.HotelView
     */
    self.slideInLeft = function() {
        return self.animateIn;
    };

    /**
     * Updates the class property to slide the menu out.
     *
     * @function app.HotelView.slideOutLeft
     * @memberof app.HotelView
     */
    self.slideOutLeft = function() {
        return self.animateOut;
    };

}; // HotelView
