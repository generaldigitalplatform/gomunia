var mongoose = require('mongoose'),
	  ChatModel = mongoose.model('Chat'),
    logger = require('../../utils/logger'),
    FCMModel = mongoose.model('FCM'),
    Promise = require('promise'),
    shortid  = require('shortid'),
    msgModel = require('../models/MessageModel');
    request          = require('request'),
    fs         = require('fs'),
    moment  = require('moment');

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

    var query = {"chatId":req.param('chatId')}

    var lteQuery;
    var gteQuery
    var toDate;
    var fromDate;
    var startTime = "T00:00:00.000Z";
    var toTime = "T23:59:00.000Z";;
    var messageDates = req.param('messageDates');

    if(messageDates === '0') {
      gteQuery = moment(new Date()).format("YYYY-MM-DD")+startTime;
      lteQuery = moment(new Date()).format("YYYY-MM-DD")+toTime;
      query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
    }
    else if(messageDates === '1') {
    
      var today = new Date();
      var yesterday = new Date(today);
      yesterday.setDate(today.getDate()-1);

      gteQuery = moment(yesterday).format("YYYY-MM-DD")+startTime;
      lteQuery = moment(yesterday).format("YYYY-MM-DD")+toTime;

      query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
    }
    else if(messageDates === '2') {  

      gteQuery = moment().startOf('isoweek').format("YYYY-MM-DD")+startTime;
      lteQuery =  moment().endOf('isoweek').format("YYYY-MM-DD")+toTime;
      query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
    }
    else if(messageDates === '3') {  

      gteQuery = moment().subtract(1, 'weeks').startOf('isoweek').format("YYYY-MM-DD")+startTime;
      lteQuery =  moment().subtract(1, 'weeks').endOf('isoweek').format("YYYY-MM-DD")+toTime;
      query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
    }
    else if(messageDates === '4') {
    
      gteQuery = moment().startOf('month').format("YYYY-MM-DD")+startTime;
            lteQuery   = moment().endOf('month').format("YYYY-MM-DD")+toTime;  
      query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
    }
    else if(messageDates === '5') {

      gteQuery = moment().subtract(1, 'months').startOf('month').format("YYYY-MM-DD")+startTime;
      lteQuery = moment().subtract(1, 'months').endOf('month').format("YYYY-MM-DD")+toTime;
      query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
    }
    else if(messageDates === '6') {

      gteQuery = moment().startOf('year').format("YYYY-MM-DD")+startTime;
          lteQuery   = moment().endOf('year').format("YYYY-MM-DD")+toTime; 
      query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
    }

    msgModel.find(query,{},{$sort : { createdAt : -1}},function(err,chatprofile){
        if(err) {
             logger.error(err)
             return res.send(err);
         }          
          res.json(chatprofile);
        });
};
// exports.findChatImage = function(req,res){
// request
//   .get('https://en.wikipedia.org/wiki/Munia#/media/File:Chestnut-breasted_Mannikin444.jpg')
//   .on('response', function(response) {
//     console.log(response.statusCode) // 200
//     console.log(response.headers['content-type']) // 'image/png'
//   })
//   .pipe(request.put('http://localhost:3000/img.png'))

 //  var filename = __dirname + '/../../public/images/rJMqAu1ab.png';


 // var readStream = fs.createReadStream(filename);

 //  // This will wait until we know the readable stream is actually valid before piping
 //  readStream.on('open', function () {
 //    // This just pipes the read stream to the response object (which goes to the client)
 //    readStream.pipe(request.put('http://localhost:3000/public/images/rJMqAu1ab.png'));
 //  });

 //  // This catches any errors that happen while creating the readable stream (usually invalid names)
 //  readStream.on('error', function(err) {
 //    res.end(err);
 //  });

// fs.createReadStream(filename)
// .pipe(request.put('https://gomunia-server.herokuapp.com/public/images/test-WT-.png',function(error, response, body){
//     logger.info(response)}));

//   var payload_get = {     
//         url:'./public/images/rJMqAu1ab.png',
//         method: 'GET',
//         headers: {'Content-Type': 'application/json'}//,"Authorization": req.cookies.auth}   
//     }
// var payload_put = {     
//         url:'./public/images/rJMqAu1ab.png',
//         method: 'PUT',
//         headers: {'Content-Type': 'application/json'}//,"Authorization": req.cookies.auth}   
//     }
//     request.get('./public/images/rJMqAu1ab.png',function(error, response, body){
//     logger.info(response)
//   })
//   .pipe(request.put('./public/images/rJMqAu1ab.png',function(error, response, body){
//     logger.info(response)
//   })); 
  // request(payload_get,function(error, response, body){
  //   logger.info(response)
  // })
  // .pipe(request(payload_put,function(error, response, body){
  //   logger.info(response)
  // }));

//}
