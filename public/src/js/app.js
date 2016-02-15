/* app.js
----------------------------------*/


/* FIREBASE hotels.json
----------------------------------*/


function getHotels() {
    // Get our model data from Firebase server
    var hotelsRef = new Firebase('https://crackling-heat-3113.firebaseio.com/hotels');

    // Read the data only once
    /* https://www.firebase.com/docs/web/guide/retrieving-data.html#section-reading-once */
    /* https://www.firebase.com/docs/web/api/query/once.html */
    hotelsRef.once('value', function(dataSnapshot) {
        // do some stuff once
        console.log("initial data loaded!", Object.keys(dataSnapshot.val()));
        console.log('--- FIREBASE dataSnapshot---');
        console.log(dataSnapshot.val());

    }, function (errorObject) {
        // code to handle read error
        console.log("The read failed: " + errorObject.code);
    });


} // getHotels
