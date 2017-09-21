var express = require('express'),
    router = express.Router();

var deviceTokenRoute = express.Router(),
    deviceTokenController = require('../controllers/DeviceTokenController')

module.exports = function(app){

  router.use('/push',deviceTokenRoute);
  deviceTokenRoute.post('/devicetoken',deviceTokenController.createDeviceToken);

  app.use('/api',router);
}

// function sendMessageToUser(deviceId, message) {
//   var request = require('request');
//   request({
//     url: 'https://fcm.googleapis.com/fcm/send',
//     method: 'POST',
//     headers: {
//       'Content-Type' :' application/json',
//       'Authorization': 'key=AI...8o'
//     },
//     body: JSON.stringify(
//       { "data": {
//         "message": message
//       },
//         "to" : deviceId
//       }
//     )
//   }, function(error, response, body) {
//     if (error) { 
//       console.error(error, response, body); 
//     }
//     else if (response.statusCode >= 400) { 
//       console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body); 
//     }
//     else {
//       console.log('Done!')
//     }
//   });

// sendMessageToUser(
//   "d7x...KJQ",
//   { message: 'Hello puf'}
// );