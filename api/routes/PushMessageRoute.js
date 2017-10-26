var express = require('express'),
    router = express.Router();

var pushMessageRoute = express.Router(),
    pushMessageController = require('../controllers/PushMessageController');

// fcm message controller
module.exports = function(app){

 router.use('/fcm',pushMessageRoute);

 pushMessageRoute.post('/message',pushMessageController.pushMessageToDevice);
 pushMessageRoute.post('/regtoken',pushMessageController.saveFCMregistrationToken);
 pushMessageRoute.post('/chat',pushMessageController.chatMessageToDevice);
 pushMessageRoute.post('/chat/image',pushMessageController.chatImageMessageToDevice);

 app.use('/api',router);
}
