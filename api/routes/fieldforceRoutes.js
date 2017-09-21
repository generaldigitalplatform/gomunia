var express = require('express');
var fieldforceController = require('../controllers/fieldforceController');

module.exports = function(app){ 

var router = express.Router(),
fieldforceRoutes = express.Router();
router.use('/',fieldforceRoutes);

fieldforceRoutes.get('/fieldforce', fieldforceController.findAllFieldForce);
fieldforceRoutes.post('/fieldforce', fieldforceController.createNewFieldForce);
fieldforceRoutes.get('/fieldforce/:Id', fieldforceController.findFieldForceById);
fieldforceRoutes.delete('/fieldforce', fieldforceController.deleteAllFieldForce);
fieldforceRoutes.delete('/fieldforce/:Id', fieldforceController.deleteFieldForceById);
fieldforceRoutes.put('/fieldforce/:Id',fieldforceController.updateFieldForceById);

app.use('/api/employee',fieldforceRoutes);

}
