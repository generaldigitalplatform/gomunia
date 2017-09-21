var express = require('express');
var router = express.Router();
var customerProfileController = require('../controllers/customerProfileController');
var customerFeedbackController = require('../controllers/CustomerFeedbackController');

router.get('/profile', customerProfileController.findAllCustomerProfile);
router.post('/profile', customerProfileController.createNewCustomerProfile);
router.get('/profile/:Id', customerProfileController.findCustomerProfileById);
router.delete('/profile', customerProfileController.deleteAllCustomerProfile);
router.delete('/profile/:Id', customerProfileController.deleteCustomerProfileById);
router.put('/profile/:Id',customerProfileController.updateCustomerProfileById);

router.get('/feedback', customerFeedbackController.findAllCustomerFeedback);
router.get('/feedback/:Id', customerFeedbackController.findCustomerFeedbackById);
router.post('/feedback', customerFeedbackController.createNewCustomerFeedback);
router.delete('/feedback', customerFeedbackController.deleteAllCustomerFeedback);
router.put('/feedback/:Id',customerFeedbackController.updateCustomerFeedbackById);


module.exports = router;

