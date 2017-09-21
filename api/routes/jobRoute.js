var express = require('express'),
    router = express.Router(),
    passport = require('passport');

var userRoute = express.Router(),
    userController = require('../controllers/userController'),
    jobController = require('../controllers/jobController'),
    passportService = require('../config/passport'),
    //AuthenticationController = require('../controllers/EmployerAuthenticationController');
    AuthenticationController = require('../controllers/authentication'); 

//var requireAuth = passport.authenticate('jwt-employer', {session: false});
	var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});
 

module.exports = function(app){

	var apiRoutes = express.Router(),
    jobRoutes = express.Router();

  	apiRoutes.use('/employee', jobRoutes);

    jobRoutes.get('/job',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), jobController.findAllJobs);
    jobRoutes.post('/job',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), jobController.createNewJob);
    jobRoutes.post('/jobs',jobController.createNewJobs);

    jobRoutes.get('/job/:Id',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), jobController.findJobById);
    jobRoutes.put('/job/:Id',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), jobController.updateJobById);
    jobRoutes.put('/job/edit/:Id',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), jobController.editJobById);
    jobRoutes.delete('/job/:Id',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), jobController.deleteJobById);
    jobRoutes.delete('/job',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), jobController.deleteAllJobs);

    jobRoutes.post('/jobstatus',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), jobController.findJobStatusById);

    jobRoutes.post('/searchjob',requireAuth, AuthenticationController.roleAuthorization(['employee','manager','admin']), jobController.searchJobById);

  	app.use('/api',apiRoutes);
}

