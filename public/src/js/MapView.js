var app = app || {};

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
    self.currentLocation = null;
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
    self.preload = '<div class="preload">Loading...<div class="spin"></div></div>';

    // Source: https://sites.google.com/site/gmapsdevelopment/
    self.markerUrl = 'http://maps.google.com/mapfiles/ms/icons/';
    self.markerColors = ['pink', 'blue', 'purple', 'green', 'yellow', 'red'];

    /**
     * Displays a Google Map and adds resize event listeners.
     *
     * @function app.MapView.init
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

    /**
     * Creates map markers.
     *
     * @function app.MapView.createMarkers
     * @memberof app.MapView
     */
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

            self.setInfoWin(hotel);
        } // for
    }; // createMarkers

    /**
     * Sets the animation and icon properties for the map marker.
     *
     * @function app.MapView.animateMarker
     * @memberof app.MapView
     */
    self.animateMarker = function(hotel) {
        // Animate the marker
        hotel.marker.setAnimation(google.maps.Animation.BOUNCE);

        // Display the dot version of the marker
        hotel.marker.icon = self.markerUrl + hotel.color + '-dot.png';

        // Animate the marker for 2.1 seconds
        setTimeout(function() {
            hotel.marker.setAnimation(null);
            hotel.marker.icon = self.markerUrl + hotel.color + '.png';
        }, 2100);
    }; // animateMarker

    /**
     * Gets the content or reads already set content for the infoWindow.
     * Sets currentLocation, and creates a click event listener.
     * Gets the hotel's recent tweets and inserts them into the page.
     *
     * @function app.MapView.setInfoWin
     * @memberof app.MapView
     */
    self.setInfoWin = function(hotel) {
        // Open the infoWindow when a marker is clicked
        google.maps.event.addListener(hotel.marker, 'click', function() {
            if(!hotel.content) {
                self.infoWindow.setContent(self.preload);
                self.getContent(hotel);
            }
            else
                self.infoWindow.setContent(hotel.content);

            self.infoWindow.open(self.map, hotel.marker);
            self.animateMarker(hotel);
            self.currentLocation = hotel.location;

            if(!hotel.tweets)
                self.getTweets(hotel);
            else
                self.displayTweets(hotel.tweets);
        });

    }; // setInfoWin

    /**
     * Calls the Yelp API via JSONP AJAX and sets the content of the infoWindow.
     *
     * @function app.MapView.getContent
     * @memberof app.MapView
     */
    self.getContent = function(hotel) {
        /**
         * Generates a random number and returns it as a string for OAuthentication
         * @return {string}
         */
        function nonce_generate() {
          return (Math.floor(Math.random() * 1e12).toString());
        }

        // Proof of concept of how to connect to an oAuth API with JS
        // For real world use you'd want a backend that hides your keys
        var yelpUrl = 'http://api.yelp.com/v2/business/' + hotel.id;
        var auth = app.vm.getKeys();
        var parameters = {
          oauth_consumer_key: auth.CONSUMER_KEY,
          oauth_token: auth.TOKEN,
          oauth_nonce: nonce_generate(),
          oauth_timestamp: Math.floor(Date.now() / 1000),
          oauth_signature_method: 'HMAC-SHA1',
          oauth_version: '1.0',
          callback: 'cb'
        };
        var encodedSignature = oauthSignature.generate('GET',
                                                        yelpUrl,
                                                        parameters,
                                                        auth.CONSUMER_SECRET,
                                                        auth.TOKEN_SECRET);
        parameters.oauth_signature = encodedSignature;

        $jsonp.send(yelpUrl, {
            callbackName: 'cb',
            data: parameters,
            onSuccess: function(json){
                hotel.content = self.getTemplate(hotel.name,
                                                 hotel.diamonds,
                                                 json.image_url,
                                                 json.snippet_text,
                                                 json.url);
                self.infoWindow.setContent(hotel.content);
            },
            onTimeout: function(){
                hotel.content = null;
                self.infoWindow.setContent('Error retrieving Yelp data.<br>Please try again.');
            },
                timeout: 5
        });

    }; // getContent

    /**
     * Matches the icon to diamond rating and formats html for the hotel image and review snippet.
     *
     * @function app.MapView.getTemplate
     * @memberof app.MapView
     * @returns {string} - HTML containing hotel name, diamond rating, image, and review.
     */
    self.getTemplate = function(name, diamonds, image, review, url) {
        var i = 0;
        var d = app.vm.getRatings();
        var dlength = d.length;
        var template = '';
        var icon = '';

        // Match the diamond rating to the icon text
        for(i; i < dlength; i++) {
            if(d[i].ratingValue === diamonds) {
                icon = d[i].icon;
                break;
            }
        }

        template = '<h4>' + name + '</h4>';
        template += '<i class="diamonds small">' + icon + '</i>';
        template += '<div class="gm-info-container">';
        template += '  <div class="gm-info-image"><img src="' + image + '" alt="' + name + '"></div>';
        template += '  <div class="gm-info-text">';
        template +=    '<img src="images/yelp_reviews.png" alt="Yelp Reviews"><br>';
        template +=    review + ' <a href="' + url + '">read more</a>';
        template += '  </div>';
        template += '</div>';

        return template;
    }; // getTemplate

    /**
     * Sends a GET request to api.php which accesses the Twitter API and returns JSON data.
     *
     * @function app.MapView.getTweets
     * @memberof app.MapView
     * @return {object} - JSON of the user's timeline
     */
    self.getTweets = function(hotel) {
        var twitter_api_wrapper = 'http://topwidget.co/twitter/api.php';
        var data = {
            "screen_name": hotel.twitter,
            "count": 5
        };

        // url, method, data, success, fail
        AJAX.request(twitter_api_wrapper, 'GET', data, function(response) {
            var tweets = '';
            var length = response.length;
            var t = 0;
            var txt = '';
            var img = '';
            var id = '';
            var url = 'https://twitter.com/' + hotel.twitter + '/status/';

            for(t; t < length; t++) {
                id = response[t].id_str;
                txt = response[t].text;
                img = response[t].user.profile_image_url;
                tweets += '<li class="tweet">';
                tweets += '<a href="' + url + id + '" title="@' + hotel.twitter + '" target="_blank">';
                tweets += '<img src="' + img + '" alt="@' + hotel.twitter + '"> ';
                tweets += txt + '</a>';
                tweets += '</li>';
            } // for

            hotel.tweets = tweets;
            self.displayTweets(hotel.tweets);

        },function(){
            hotel.tweets = null;
            if(window.console) console.log("AJAX request failed.");
        });

    }; // getTweets

    /**
     * Adds tweets inside the header above the map
     *
     * @function app.MapView.displayTweets
     * @memberof app.MapView
     */
    self.displayTweets = function(tweets) {
        var twitter = document.getElementById('twitter');
        twitter.innerHTML = tweets;
    }; // displayTweets

}; // MapView
