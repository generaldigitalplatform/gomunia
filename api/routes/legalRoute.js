var express = require('express'),
    router = express.Router();

var legalRoute = express.Router(),
    legalController = require('../controllers/legalController')

module.exports = function(app){

  router.use('/',legalRoute);
  legalRoute.post('/legal',legalController.createLegal);
  //legalRoute.put('/legal',legalController.updateLegal);
  legalRoute.get('/legal',legalController.getLegal);

  app.use('/',router);
}

