var AuthenticationController = require('../controllers/authentication'); 
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport'),
    employeeController =require('../controllers/employeeController');
 
 var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});
 
module.exports = function(app){
 
    var router = express.Router(),
        authRoutes = express.Router(),
        employeeRoutes = express.Router(),
        jobRoutes = express.Router();

    // Auth Routes
    router.use('/auth', authRoutes);
 
    authRoutes.post('/employee/register', AuthenticationController.employeeregister);
    authRoutes.post('/employee/login', requireLogin, AuthenticationController.employeelogin);
    authRoutes.put('/employee/reset',employeeController.resetEmployeePassword);
    authRoutes.get('/protected', requireAuth, function(req, res){
        res.send({ content: 'Success'});
    });

    authRoutes.get('/employee',employeeController.findAllEmployees);
    authRoutes.get('/employee/:Id',employeeController.findEmployeeById);
    authRoutes.put('/employee/update/:Id',employeeController.updateEmployeeById);
    authRoutes.delete('/employee/:Id',employeeController.deleteEmployeeById);

    app.use('/api', router);

}

