var express = require('express'),
    router = express.Router();

var chatGroupRoute = express.Router(),
    chatGroupController = require('../controllers/ChatGroupController')

module.exports = function(app){

  router.use('/',chatGroupRoute);
  chatGroupController.post('/chatgroup',chatGroupController.createChatGroup);

  app.use('/api',router);
}

