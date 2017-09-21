var express = require('express'),
    router = express.Router();

var googleMapRoute = express.Router(),
    googleMapRouteController = require('../controllers/googleMapsController');

module.exports = function(app){

  router.use('/maps',googleMapRoute);
  googleMapRoute.post('/location',googleMapRouteController.findGeoLocation);

  app.use('/api',router);
}
