var express = require('express'),
    router = express.Router();

var pushMessageRoute = express.Router(),
    pushMessageController = require('../controllers/PushMessageController');

// fcm message controller
module.exports = function(app){

 router.use('/fcm',pushMessageRoute);

 pushMessageRoute.post('/message',pushMessageController.pushMessageToDevice);
 pushMessageRoute.post('/regtoken',pushMessageController.saveFCMregistrationToken);

 app.use('/api',router);
}
