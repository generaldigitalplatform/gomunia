var mongoose = require('mongoose'),
	  ChatModel = mongoose.model('Chat'),
    logger = require('../../utils/logger'),
    FCMModel = mongoose.model('FCM'),
    Promise = require('promise'),
    shortid  = require('shortid'),
    msgModel = require('../models/MessageModel');

// exports.createChat = function(members){
// 	res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

//     var chat = new ChatModel({
//         members : members.split(',')
//     })

// 	chat.save(function(err,profile){
//         if(err) {
//             logger.error(err)
//             res.send(err);
//         }
//         else{
//             logger.info('Chat created between' + members[0] + 'and ' + members[1])	        
//             res.json(profile);
//         }
//     });
// };

findRegistrationIds = function(req){
    return new Promise(function(resolve,reject){
        var regidObj={};    
        var registrationids=[];
        var members = req.body.members;
        for(var i=0; i< Object.keys(members).length;i++){
               FCMModel.findOne({"UserId":members[i].emailid},function (err,response) {
               regidObj['emailid'] =response.UserId;
               regidObj['registration_id'] = response.FCMregistrationToken;
               registrationids.push(regidObj);    
               regidObj = {};
               if (registrationids.length === Object.keys(members).length)
               {
                    resolve(registrationids);  
               }                        

            });
            
        }
        
    })
}
exports.createChat = function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if(req.body.chatId){
        var query = {"chatId":req.body.chatId}
        ChatModel.findOne(query,function(err,chatprofile){
            if(err){
                 logger.error(err)
                 res.send(err);
            }else{           
            res.json(chatprofile);
            }
        });
    }
    else{
        findRegistrationIds(req)
        .then(function(members){
            var chat = new ChatModel({
            chatId:shortid.generate(),         
            members : members 
            })
            chat.save(function(err,chatprofile){
                if(err) {
                    logger.error(err)
                    res.send(err);
                }
                else{
                    logger.info('Chat created between' + chatprofile.members[0].emailid + 'and ' + chatprofile.members[1].emailid)          
                    res.json(chatprofile);
                }
            });
        })
       //  var registrationids=[];
       //  var members = req.body.members.split(',');
       // for(var i=0; i< Object.keys(members).length;i++){
       //         FCMModel.findOne({"UserId":members[i]},function (err,response) {
       //         registrationids.push(response.FCMregistrationToken);              
       //      });
       //  }
       
    }
};
exports.findMessagesByChatId = function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var query = {"chatId":req.query.chatId}

    msgModel.find(query,{},{$sort : { createdAt : -1}},function(err,chatprofile){
        if(err) {
             logger.error(err)
             return res.send(err);
         }          
          res.json(chatprofile);
        });
};