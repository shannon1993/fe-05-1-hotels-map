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

    self.slide = document.getElementById('slide');
    self.animateIn = 'animated slideInLeft no-overlay';
    self.animateOut = 'animated fadeOutLeft overlay';
    self.h3 = document.getElementsByTagName('h3');
    self.def = document.getElementById('definitions');

    /**
     * Updates the class property to slide the menu in.
     *
     * @function app.HotelView.slideInLeft
     * @memberof app.HotelView
     */
    self.slideInLeft = function() {
        self.slide.className = self.animateIn;
    };

    /**
     * Updates the class property to slide the menu out.
     *
     * @function app.HotelView.slideOutLeft
     * @memberof app.HotelView
     */
    self.slideOutLeft = function() {
        self.slide.className = self.animateOut;
    };

    /**
     * Adds 'block' to display property.
     *
     * @function app.HotelView.openInfo
     * @memberof app.HotelView
     */
    self.openInfo = function() {
        self.def.style.display = 'block';
    };

    /**
     * Removes 'block' from display property.
     *
     * @function app.HotelView.closeInfo
     * @memberof app.HotelView
     */
    self.closeInfo = function() {
        self.def.style.display = '';
    };

    /**
     * Toggles arrow icon and toggles display of the section under the header.
     *
     * @function app.HotelView.toggleDisplay
     * @memberof app.HotelView
     */
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

    /**
     * Updates the class property for the icon inside the header.
     *
     * @function app.HotelView.setIcon
     * @memberof app.HotelView
     */
    self.setIcon = function(e) {
        var elem;

        // Fix for when the triangle icon is clicked inside the h3
        if(e.target.nodeName === 'H3') {
            elem = e.target;
        } else {
            // Traverse up the DOM one level
            elem = e.target.parentNode;
        }

        elem.firstChild.className = self.toggleDisplay(elem, elem.firstChild.className);
    };

    /**
     * Creates click event listeners for each h3 heading.
     *
     * @function app.HotelView.init
     * @memberof app.HotelView
     */
    self.init = function() {
        var i = 0;
        var len = self.h3.length;

        for(i; i < len; i++) {
            // Add a click event for each h3 heading
            self.h3[i].addEventListener('click', self.setIcon, false);
        } // for
    };

}; // HotelView
