var express = require('express'),
    router = express.Router();

var pushMessageRoute = express.Router(),
    pushMessageController = require('../controllers/PushMessageController');

// fcm message controller
module.exports = function(app){

 router.use('/fcm',pushMessageRoute);

 pushMessageRoute.post('/message',pushMessageController.pushMessageToDevice);
 pushMessageRoute.post('/regtoken',pushMessageController.saveFCMregistrationToken);
 pushMessageRoute.post('/chat/send',pushMessageController.sendMessageToDevice);
 pushMessageRoute.post('/chat/create',pushMessageController.createChat);
 pushMessageRoute.get('/chat',pushMessageController.findMessagesByChatId);
 pushMessageRoute.get('/chat/:Id',pushMessageController.findChatMembers);
 pushMessageRoute.post('/chatgroup/create',pushMessageController.createChatGroup);
 pushMessageRoute.post('/chatgroup/add/users',pushMessageController.addUsersToChatGroup);
 pushMessageRoute.post('/chatgroup/remove/users',pushMessageController.removeUsersFromChatGroup);

 app.use('/api',router);
}
