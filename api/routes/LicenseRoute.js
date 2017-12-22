var AuthenticationController = require('../controllers/authentication'); 
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport'),
    licenseController =require('../controllers/LicenseController');
 
 var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});
 
module.exports = function(app){
 
    var router = express.Router(),
        licenseRoutes = express.Router();
    // Auth Routes
    router.use('/license', licenseRoutes);

    licenseRoutes.post('/create',licenseController.createLicense);
    licenseRoutes.post('/validate',licenseController.validateLicense);
    licenseRoutes.post('/release',licenseController.releaseLicense);

    // licenseRoutes.get('/protected', requireAuth, function(req, res){
    //     res.send({ content: 'Success'});
    // });
    // licenseRoutes.get('/find',licenseController.findAllLicense);
    // licenseRoutes.get('/find/:Id',licenseController.findLicenseById);
    // licenseRoutes.put('/update/:Id',licenseController.updateLicenseById);
    // licenseRoutes.delete('/find/:Id',licenseController.deleteLicenseById);

    app.use('/api', router);

}

