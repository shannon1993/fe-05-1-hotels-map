# Las Vegas Diamond Hotels Map

Web app to display a selection of Las Vegas hotels inspected and rated by [AAA](http://newsroom.aaa.com/diamond-ratings/), which uses the [Diamond Rating](http://newsroom.aaa.com/diamond-ratings/diamond-rating-definitions/) system.

#### Features
* Filter by hotel name
* Filter by diamond rating
* Mobile first design
* Hotel reviews from Yelp
* Hotel tweets from Twitter

## How to run
#### Local
1. Navigate to the `public` folder
2. Open the `index.html` in either the `src` or `dist` folders

#### Online
1. http://m-coding.github.io/fe-05-1-hotels-map/

## How to re-build
1. Requires [Node.js](https://nodejs.org/en/download/) and [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
2. Navigate to the root of the project directory (where the `gulpfile.js` is located)
3. In your terminal enter the command: `npm install`, this will install all modules listed as dependencies in `package.json`
4. Enter the command `gulp clean` to delete everything in the `dist` folder.
  * If you want to preview what files will be deleted, enter the command `gulp cleanDryRun` instead.
5. Next enter the command `gulp` and the project will be built in the `dist` folder.
  * You can review differences by comparing the `src` and `dist` folder.

## Documentation

* Generated by JSDoc `public/docs/jsdoc`
* Generated by Docco `public/docs/docco`

## Notes
#### Dependencies
* [Firebase](https://www.firebase.com/) – Remote host where hotels.json is stored
* [KnockoutJS](http://knockoutjs.com/) – Model-View-ViewModel Framework
* [Google Maps](https://developers.google.com/maps/) – Maps API used to display map
* [OAuth Signature Generator](https://github.com/bettiolo/oauth-signature-js) – Javascript library to make OAuth requests
* [Yelp](https://www.yelp.com/developers) – Yelp API to display hotel image and review
* [Twitter](https://dev.twitter.com/rest/public) – Twitter API to display a hotel's recent tweets

#### CSS
* [normalize.css](https://necolas.github.io/normalize.css/) – Used for base reset
* [animate.css](http://daneden.me/animate) – Used for slide in and slide out animations
* [CSS Loading Spinner](http://www.designcouch.com/home/why/2013/05/23/dead-simple-pure-css-loading-spinner) – Used for circle loading spinner for map and yelp api
* [Off Canvas Menus](https://scotch.io/tutorials/off-canvas-menus-with-css3-transitions-and-transforms) – Reference used when I created the filter menu

#### Map API
* [Google Map Files](https://sites.google.com/site/gmapsdevelopment/) – Alternative map marker images

#### Yelp API
* [Display Requirements](https://www.yelp.com/developers/display_requirements) – Developer page for Yelp branding images

#### Twitter API
* [Application-only authentication](Application-only authentication) – Method used in `api.php` to connect to Twitter's API
* [statuses/user_timeline](https://dev.twitter.com/rest/reference/get/statuses/user_timeline) – Returns a collection of the most recent Tweets posted by a user

#### JSONP AJAX
* [jsonp.js](https://github.com/sobstel/jsonp.js) – Lightweight JSONP library for cross-domain ajax calls. Method used to connect to Yelp's API.

#### XMLHttpRequest
* [XMLHttpRequest advanced features](http://caniuse.com/#feat=xhr2) – Lists which browsers support XHR2 spec
* [Vanilla Ajax without jQuery](http://www.sitepoint.com/guide-vanilla-ajax-without-jquery/) – Nice guide
* [InvalidStateError raised when setting XMLHttpRequest.responseType](https://bugzilla.mozilla.org/show_bug.cgi?id=1110761) – Useful Bugzilla note to set the `responseType` after calling `.open()`
* [Test JSON support for responseType](https://mathiasbynens.be/notes/xhr-responsetype-json) – Useful info for testing
* [HTTP access control (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) – Good MDN doc for setting up CORS
* [Setting CORS (cross-origin resource sharing) on Apache ](https://benjaminhorn.io/code/setting-cors-cross-origin-resource-sharing-on-apache-with-correct-response-headers-allowing-everything-through/) – Helpful article for setting up my `.htaccess` to allow CORS

#### Fonts
* [Fontello](http://fontello.com/) – Icon generator. Used for arrow, info, hamburger, and info icons.
* [MyFonts](http://www.myfonts.com/fonts/ascender/ayita-pro/semi-bold/) – Free font Ayita Pro SemiBold. Used this font for the headings.

# Change Log
* [All commits](https://github.com/m-coding/fe-05-hotels-map/commits/master)
* [All releases](https://github.com/m-coding/fe-05-hotels-map/releases)