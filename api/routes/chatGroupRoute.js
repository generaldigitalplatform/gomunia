var express = require('express'),
    router = express.Router();

var chatGroupRoute = express.Router(),
    chatGroupController = require('../controllers/ChatGroupController')

module.exports = function(app){

  router.use('/',chatGroupRoute);
  chatGroupRoute.post('/chatgroup/create',chatGroupController.createChatGroup);
  chatGroupRoute.post('/chatgroup/add',chatGroupController.addUsersToChatGroup);
  chatGroupRoute.post('/chatgroup/remove',chatGroupController.removeUsersFromChatGroup);

  app.use('/api',router);
}

