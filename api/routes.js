var AuthenticationController = require('./controllers/authentication'), 
    express = require('express'),
    passportService = require('./config/passport'),
    passport = require('passport'),
    customerProfileController = require('./controllers/customerProfileController'),
    customerFeedbackController = require('./controllers/CustomerFeedbackController'),
    employeeProfileController = require('./controllers/EmployeeProfileController'),
    jobController = require('./controllers/jobController'),
    employeeLocationController = require('./controllers/EmployeeLocationController');
 
var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});
 
module.exports = function(app){
 
    var apiRoutes = express.Router(),
        authRoutes = express.Router(),
        customerProfileRoutes = express.Router(),
        customerProfileFeedbackRoutes = express.Router();
        employeeProfileRoutes = express.Router(),
        jobRoutes = express.Router();
        locationRoutes = express.Router(),
        reportsRoutes = express.Router();
    // Auth Routes
    apiRoutes.use('/auth', authRoutes);
 
    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/login', requireLogin, AuthenticationController.login);
 
    authRoutes.get('/protected', requireAuth, function(req, res){
        res.send({ content: 'Success'});
    });
 
    // Todo Routes
    apiRoutes.use('/customer', customerProfileRoutes);
 

    customerProfileRoutes.get('/profile', requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']),customerProfileController.findAllCustomerProfile);
    customerProfileRoutes.post('/profile', requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']),customerProfileController.createNewCustomerProfile);
    customerProfileRoutes.get('/profile/:Id',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), customerProfileController.findCustomerProfileById);
    customerProfileRoutes.delete('/profile', requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']),customerProfileController.deleteAllCustomerProfile);
    customerProfileRoutes.delete('/profile/:Id', customerProfileController.deleteCustomerProfileById);
    customerProfileRoutes.put('/profile/:Id',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']),customerProfileController.updateCustomerProfileById);

    customerProfileRoutes.post('/profile/count',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), customerProfileController.findTotalCallById);

    apiRoutes.use('/customer', customerProfileFeedbackRoutes);
 

    customerProfileFeedbackRoutes.get('/feedback',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), customerFeedbackController.findAllCustomerFeedback);
    customerProfileFeedbackRoutes.get('/feedback/:Id',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), customerFeedbackController.findCustomerFeedbackById);
    customerProfileFeedbackRoutes.post('/feedback',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), customerFeedbackController.createNewCustomerFeedback);
    customerProfileFeedbackRoutes.delete('/feedback',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), customerFeedbackController.deleteAllCustomerFeedback);
    customerProfileFeedbackRoutes.put('/feedback/:Id',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']),customerFeedbackController.updateCustomerFeedbackById);

    customerProfileFeedbackRoutes.post('/feedback/count',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), customerFeedbackController.findProductFeedbackDetailsCountById);

    apiRoutes.use('/employee', employeeProfileRoutes);
 

    employeeProfileRoutes.get('/profile', requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']),employeeProfileController.findAllEmployeeProfile);
    employeeProfileRoutes.post('/profile',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), employeeProfileController.createNewEmployeeProfile);
    employeeProfileRoutes.get('/profile/:Id', requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']),employeeProfileController.findEmployeeProfileById);
    employeeProfileRoutes.put('/profile/:Id',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), employeeProfileController.updateEmployeeProfileById);
    employeeProfileRoutes.delete('/profile/:Id',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), employeeProfileController.deleteEmployeeProfileById);
    employeeProfileRoutes.delete('/profile',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), employeeProfileController.deleteAllEmployeeProfile);


    // apiRoutes.use('/employee', jobRoutes);
 

    // jobRoutes.get('/job',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), jobController.findAllJobs);
    // jobRoutes.post('/job',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), jobController.createNewJob);
    // jobRoutes.post('/jobs',jobController.createNewJobs);

    // jobRoutes.get('/job/:Id',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), jobController.findJobById);
    // jobRoutes.put('/job/:Id',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), jobController.updateJobById);
    // jobRoutes.put('/job/edit/:Id',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), jobController.editJobById);
    // jobRoutes.delete('/job/:Id',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), jobController.deleteJobById);
    // jobRoutes.delete('/job',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), jobController.deleteAllJobs);

    // jobRoutes.post('/jobstatus',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), jobController.findJobStatusById);

    // jobRoutes.post('/searchjob',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), jobController.searchJobById);

    apiRoutes.use('/employee/telesales',reportsRoutes);
    reportsRoutes.get('/reports',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), jobController.searchJobById);

    apiRoutes.use('/employee', locationRoutes);

    locationRoutes.get('/location',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), employeeLocationController.findAllEmployeeLocation);
    locationRoutes.post('/location',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), employeeLocationController.createEmployeeLocation);
    locationRoutes.get('/location/:Id',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), employeeLocationController.findEmployeeLocationById);
    locationRoutes.put('/location/:Id',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), employeeLocationController.updateEmployeeLocationById);
    locationRoutes.delete('/location/:Id',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), employeeLocationController.deleteEmployeeLocationById);
    locationRoutes.delete('/location',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), employeeLocationController.deleteAllEmployeeLocations);

    // todoRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['reader','creator','editor']), TodoController.getTodos);
 
    // Set up routes
    app.use('/api', apiRoutes);
 
}