/* app.js
----------------------------------*/


/* FIREBASE hotels.json
----------------------------------*/

// Get our model data from Firebase server
var firebaseRef = new Firebase('https://crackling-heat-3113.firebaseio.com/hotels');

// Read the data only once
/* https://www.firebase.com/docs/web/guide/retrieving-data.html#section-reading-once */
/* https://www.firebase.com/docs/web/api/query/once.html */
firebaseRef.once('value', function(dataSnapshot) {
    // do some stuff once
    console.log("initial data loaded!", Object.keys(dataSnapshot.val()));

}, function (err) {
    // code to handle read error
    console.log('ERROR: Could not read data from Firebase');
});

