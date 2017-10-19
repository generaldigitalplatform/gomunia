var express = require('express'),
    router = express.Router();

var chatRoute = express.Router(),
    chatController = require('../controllers/ChatController')

module.exports = function(app){

  router.use('/',chatRoute);
  chatRoute.post('/chat',chatController.createChat);
  chatRoute.get('/chat',chatController.findMessagesByChatId)
  app.use('/api',router);
}

