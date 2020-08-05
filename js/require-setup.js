// file: js/require-setup.js
//
// Declare this variable before loading RequireJS JavaScript library
// To config RequireJS after it’s loaded, pass the below object into require.config();

require.config({
    waitSeconds: 200,
    paths: {
        jquery               : '../lib/jquery-1.12/jquery-1.12.0.min',
        bootstrap           : 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min',
        leaflet             : '../lib/leaflet-v0.7.7/leaflet'
        
    },
    shim : {
        jquery              : { },
        bootstrap           : {deps : ['jquery']},
        leaflet             : {exports: 'L'}
    }
});
