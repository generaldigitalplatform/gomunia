//var AuthenticationController = require('../controllers/EmployerAuthenticationController'), 
   var AuthenticationController = require('../controllers/authentication'); 

    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');
    employerController = require('../controllers/employerController');
 
// var requireAuth = passport.authenticate('jwt-employer', {session: false});
// var requireLogin = passport.authenticate('local-employer', {session: false});
 var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});
 

module.exports = function(app){
 
    var router = express.Router(),
        authRoutes = express.Router(),
        empRoutes = express.Router();

    // Auth Routes
    router.use('/auth', authRoutes);
 
    authRoutes.post('/employer/register', AuthenticationController.employerregister);
    authRoutes.post('/employer/login', requireLogin,AuthenticationController.roleAuthorization(['manager','admin']), AuthenticationController.employerlogin);
    authRoutes.put('/employer/reset', employerController.resetEmployerPassword);
 
    authRoutes.get('/protected', function(req, res){
        res.send({ content: 'Success'});
    });

    authRoutes.get('/employer', employerController.findAllEmployers);
    authRoutes.get('/employer/:Id',employerController.findEmployerById);
    authRoutes.put('/employer/update/:Id',employerController.updateEmployerById);
    authRoutes.delete('/employer/:Id',employerController.deleteEmployerById);

    app.use('/api', router);

}

