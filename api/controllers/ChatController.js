// var mongoose    = require('mongoose'),
// 	  ChatModel   = mongoose.model('Chat'),
//     logger      = require('../../utils/logger'),
//     FCMModel    = mongoose.model('FCM'),
//     Promise     = require('promise'),
//     shortid     = require('shortid'),
//     msgModel    = require('../models/MessageModel');
//     request     = require('request'),
//     fs          = require('fs'),
//     moment      = require('moment');

// buildChatObject = function(createdBy,member){
//   return new Promise(function(resolve,reject){
//     var regidObj = {};
//     var createdByObj = {
//       email : createdBy.email,
//       firstname : createdBy.firstname,
//       lastname : createdBy.lastname,
//       primaryphone : createdBy.primaryphone,
//       employerid : createdBy.employerid,
//       employeeid : createdBy.employeeid,
//     };   
//     var memberObj = {
//       email: member.email,
//       firstname: member.firstname,
//       lastname: member.lastname,
//       primaryphone: member.primaryphone,
//       employerid: member.employerid,
//       employeeid: member.employeeid,
//     };
//     FCMModel.findOne({"UserId":memberObj.email},function (error,response){ 
//       if(error){
//         reject(errror)    
//       }              
//       else if(response){
//         memberObj.registration_id = response.FCMregistrationToken;
//         regidObj['createdBy'] = createdByObj;
//         regidObj['member'] = memberObj;
//         resolve(regidObj);
//       }
//       else{
//         reject(response)    
//       }      
//     });     
//   })
// }
// pushMessage = function(receiver_registration_id,message){
//   return new Promise(function(resolve,reject){
//     var payload = {
//       data: {
//         message:message
//       }
//     };
//     admin.messaging().sendToDevice(receiver_registration_id, payload)
//     .then(function(response) {
//       logger.info('Message pushed to device');
//       resolve('Success');
//     })
//     .catch(function(error) {
//       logger.error('Failed to push message, the reason is : '+ error);
//       reject(error);
//     });
//   })  
// }
// saveChatOnDb = function(chatObject){
//     return new Promise(function(resolve,reject){
//       var chat = new ChatModel(chatObject);
//       chat.save(function(err,chatprofile){
//           if(err) {
//               reject(err)
//           }
//           else{
//               resolve(chatprofile);
//           }
//         });
//     })   
// }
// exports.createChat = function(req,res){
//   var createdBy = req.body.createdBy;
//   var member =  req.body.member;
//     // if(req.body.chatId){
//     //     var query = {"_id":req.body.chatId}
//     //     ChatModel.findOne(query,function(err,chatprofile){
//     //         if(err){
//     //              logger.error(err)
//     //              res.send(err);
//     //         }else{           
//     //             res.json(chatprofile);
//     //         }
//     //     });
//     // }
//     // else{
//   buildChatObject(createdBy,member)
//   .then(function(members){
//       saveChatOnDb(members)
//       // Promise.all([
//       //     saveChatOnDb(chatId,members),
//       //     pushMessage(receiver_registration_id,members)            
//       // ])
//       .then(function(chatprofile){
//         logger.info('chat created');
//         res.status(200).send(chatprofile).end();
//       })
//       .catch(function(error){
//           logger.error(error);
//           res.send({error:error}).end();
//       });
//   })
//     //}
// };
// exports.findChatMembers = function(req,res){
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

//     var regidObj={};
//     var registrationids=[];
    
//     var query = {"createdBy.employeeid": req.params.Id } ;

//     //var query = {"employee.employerid":req.params.Id}
  
//     ChatModel.find(query,{},function(err,chatprofile){
//     if(err) {
//            logger.error(err)
//            return res.send(err);
//        }
//        for(var i=0; i< Object.keys(chatprofile).length;i++){    

//          var findChatQuery = {"chatId": chatprofile[i]._id } ;
//           regidObj['chatId'] = chatprofile[i]._id;
//           regidObj['firstname'] = chatprofile[i].member.firstname;
//           regidObj['lastname'] = chatprofile[i].member.lastname;
//           regidObj['primaryphone'] = chatprofile[i].member.primaryphone;
//           regidObj['email'] = chatprofile[i].member.email;
//           regidObj['employerid'] = chatprofile[i].member.employerid;
//           regidObj['employeeid'] = chatprofile[i].member.employeeid;
//           regidObj['delivered'] = chatprofile[i].member.delivered;
//           regidObj['read'] = chatprofile[i].member.read;
//           regidObj['last_seen'] = chatprofile[i].member.last_seen;
//           regidObj['registration_id'] = chatprofile[i].member.registration_id;

//           msgModel.find(findChatQuery,{},function(err,chat){


//           });

//           registrationids.push(regidObj);
//           regidObj = {};         
//       }
//        res.json(registrationids);
//     });
// };
// exports.findMessagesByChatId = function(req,res){
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

//     var query = {"chatId":req.param('chatId')}

//     var lteQuery;
//     var gteQuery
//     var toDate;
//     var fromDate;
//     var startTime = "T00:00:00.000Z";
//     var toTime = "T23:59:00.000Z";;
//     var messageDates = req.param('messageDates');

//     if(messageDates === '0') {
//       gteQuery = moment(new Date()).format("YYYY-MM-DD")+startTime;
//       lteQuery = moment(new Date()).format("YYYY-MM-DD")+toTime;
//       query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
//     }
//     else if(messageDates === '1') {
    
//       var today = new Date();
//       var yesterday = new Date(today);
//       yesterday.setDate(today.getDate()-1);

//       gteQuery = moment(yesterday).format("YYYY-MM-DD")+startTime;
//       lteQuery = moment(yesterday).format("YYYY-MM-DD")+toTime;

//       query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
//     }
//     else if(messageDates === '2') {  

//       gteQuery = moment().startOf('isoweek').format("YYYY-MM-DD")+startTime;
//       lteQuery =  moment().endOf('isoweek').format("YYYY-MM-DD")+toTime;
//       query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
//     }
//     else if(messageDates === '3') {  

//       gteQuery = moment().subtract(1, 'weeks').startOf('isoweek').format("YYYY-MM-DD")+startTime;
//       lteQuery =  moment().subtract(1, 'weeks').endOf('isoweek').format("YYYY-MM-DD")+toTime;
//       query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
//     }
//     else if(messageDates === '4') {
    
//       gteQuery = moment().startOf('month').format("YYYY-MM-DD")+startTime;
//             lteQuery   = moment().endOf('month').format("YYYY-MM-DD")+toTime;  
//       query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
//     }
//     else if(messageDates === '5') {

//       gteQuery = moment().subtract(1, 'months').startOf('month').format("YYYY-MM-DD")+startTime;
//       lteQuery = moment().subtract(1, 'months').endOf('month').format("YYYY-MM-DD")+toTime;
//       query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
//     }
//     else if(messageDates === '6') {

//       gteQuery = moment().startOf('year').format("YYYY-MM-DD")+startTime;
//           lteQuery   = moment().endOf('year').format("YYYY-MM-DD")+toTime; 
//       query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
//     }

//     msgModel.find(query,{},function(err,chatprofile){
//         if(err) {
//              logger.error(err)
//              return res.send(err);
//          }          
//           res.json(chatprofile);
//         }).sort({ createdAt : -1});
// };

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
