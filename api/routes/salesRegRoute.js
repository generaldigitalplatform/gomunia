var express = require('express'),
    router = express.Router();

var salesRegRoute = express.Router(),
    salesRegController = require('../controllers/SalesRegController')

module.exports = function(app){

  router.use('/',salesRegRoute);
  salesRegRoute.post('/salesreg',salesRegController.createSalesQuery);

  app.use('/api',router);
}

