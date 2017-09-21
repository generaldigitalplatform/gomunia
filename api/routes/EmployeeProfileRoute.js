var express = require('express');
var router = express.Router();
var employeeProfileController = require('../controllers/EmployeeProfileController');
var jobController = require('../controllers/jobController');
var employeeLocationController = require('../controllers/EmployeeLocationController');

router.get('/profile', employeeProfileController.findAllEmployeeProfile);
router.post('/profile', employeeProfileController.createNewEmployeeProfile);
router.get('/profile/:Id', employeeProfileController.findEmployeeProfileById);
router.put('/profile/:Id', employeeProfileController.updateEmployeeProfileById);
router.delete('/profile/:Id', employeeProfileController.deleteEmployeeProfileById);
router.delete('/profile', employeeProfileController.deleteAllEmployeeProfile);

router.get('/job', jobController.findAllJobs);
router.post('/job', jobController.createNewJob);
router.get('/job/:Id', jobController.findJobById);
router.put('/job/:Id', jobController.updateJobById);
router.delete('/job/:Id', jobController.deleteJobById);
router.delete('/job', jobController.deleteAllJobs);

router.get('/location', employeeLocationController.findAllEmployeeLocation);
router.post('/location', employeeLocationController.createEmployeeLocation);
router.get('/location/:Id', employeeLocationController.findEmployeeLocationById);
router.put('/location/:Id', employeeLocationController.updateEmployeeLocationById);
router.delete('/location/:Id', employeeLocationController.deleteEmployeeLocationById);
router.delete('/location', employeeLocationController.deleteAllEmployeeLocations);

module.exports = router;
