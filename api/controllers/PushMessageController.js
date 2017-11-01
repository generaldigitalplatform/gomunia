// 'use strict';

var mongoose 		 = require('mongoose'),
	mongoose = require('mongoose'),
 	admin 			 = require('firebase-admin'),
 	serviceAccount 	 = require('../config/gdsfieldforce-firebase-adminsdk-m5ezh-beffa09b38'),
	pushMessageModel = require('../models/PushMessageModel'),
	chatModel 		 = require('../models/ChatModel'),
	messageModel 	 = require('../models/MessageModel'),
    // multer			 = require('multer'),
	//path 			 = require('path'),
	logger           = require('../../utils/logger'),
	fs 				 = require('fs'),
    Storage 		 = require('@google-cloud/storage'),
	stream 			 = require('stream'),
	config           = require('../config/database'),
	Promise 		 = require('promise'), 	
    logger      	 = require('../../utils/logger'),
    FCMModel   	 	 = mongoose.model('FCM'),
    request     	 = require('request'),
    moment      	 = require('moment'),
    gcs 			 = require('@google-cloud/storage')({
						  projectId: config.google_gdsfieldforce_project_id,
				 		  keyFilename: __dirname + '/../config/gdsfieldforce-firebase-adminsdk-m5ezh-beffa09b38.json'
						});

admin.initializeApp({
	  credential: admin.credential.cert(serviceAccount),
	  databaseURL: "https://gdsfieldforce.firebaseio.com/"
	});   
	//Define bucket.
const bucket_name = 'gdsfieldforce.appspot.com' ;
var myBucket = gcs.bucket(bucket_name);

	// var storage = multer.diskStorage({
	//   destination: function (req, file, cb) {
	//     cb(null, './public/')
	//   },
	//   filename: function (req, file, cb) {
	//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
	//   }
	// })

uploadImageOnLocalServer = function(img_filename,imgdata){
	return new Promise(function (resolve,reject){	
		fs.writeFile(__dirname + '/../../public/images/'+img_filename, buf , (err) => {
	  	if (err){

	  	}

	  	});
		 
	})
}
uploadImageOnGoogleStorage = function(img_filename,imgdata){
	return new Promise(function (resolve,reject){	
		var bufferStream = new stream.PassThrough();
		bufferStream.end(new Buffer(imgdata, 'base64'));
		var file = myBucket.file(img_filename);
		var fileType = img_filename.split('.')[1];

		//Pipe the 'bufferStream' into a 'file.createWriteStream' method.
		bufferStream.pipe(file.createWriteStream({
		    metadata: {
		      contentType: 'image/'+fileType,
		      metadata: {
		        custom: 'metadata'
		      }
		    },
		    public: true,
		    validation: "md5"
		  }))
		  .on('error', function(err) {
		  	reject(err);
		  })
		  .on('finish', function(req) {
		   	message = config.googlecloudstorage_url + bucket_name +'/'+img_filename;  
		   	resolve(message);
		  });

	})
}
pushMessage = function(receiver_registration_id,message){
	return new Promise(function(resolve,reject){
		var payload = {
		  data: {
		    message:message
		  }
		};
		admin.messaging().sendToDevice(receiver_registration_id, payload)
		.then(function(response) {			
			resolve(response);
		})
		.catch(function(error) {			
			reject(error);
		});
	})	
}
buildChatObject = function(createdBy,member){
  return new Promise(function(resolve,reject){
    var regidObj = {};
    var createdByObj = {
      email : createdBy.email,
      firstname : createdBy.firstname,
      lastname : createdBy.lastname,
      primaryphone : createdBy.primaryphone,
      employerid : createdBy.employerid,
      employeeid : createdBy.employeeid,
    };   
    var memberObj = {
      email: member.email,
      firstname: member.firstname,
      lastname: member.lastname,
      primaryphone: member.primaryphone,
      employerid: member.employerid,
      employeeid: member.employeeid,
    };
    FCMModel.findOne({"UserId":memberObj.email},function (error,response){ 
      if(error){
        reject(errror)    
      }              
      else if(response){
        memberObj.registration_id = response.FCMregistrationToken;
        regidObj['createdBy'] = createdByObj;
        regidObj['member'] = memberObj;
        resolve(regidObj);
      }
      else{
        reject(response)    
      }      
    });     
  })
}
saveChatOnDb = function(chatObject){
    return new Promise(function(resolve,reject){
      var chat = new chatModel(chatObject);
      chat.save(function(err,chatprofile){
          if(err) {
              reject(err)
          }
          else{
              resolve(chatprofile);
          }
        });
    })   
}
saveMessageOnDb = function(chatId,author,messagePayload){	
	return new Promise(function(resolve, reject){	
	    msgModel = new messageModel({
			chatId : chatId,
			author:author,
			messagePayload : messagePayload		
		});
		msgModel.save(function(err,profile){
	    if(err) {
             logger.error(err)
             reject(err);	            
        }else{         	
         	resolve(profile);
        }        
         
		});	
	});
}
exports.createChat = function(req,res){
  var createdBy = req.body.createdBy;
  var member =  req.body.member;
    // if(req.body.chatId){
    //     var query = {"_id":req.body.chatId}
    //     ChatModel.findOne(query,function(err,chatprofile){
    //         if(err){
    //              logger.error(err)
    //              res.send(err);
    //         }else{           
    //             res.json(chatprofile);
    //         }
    //     });
    // }
    // else{
  buildChatObject(createdBy,member)
  .then(function(members){
      saveChatOnDb(members)
      // Promise.all([
      //     saveChatOnDb(chatId,members),
      //     pushMessage(receiver_registration_id,members)            
      // ])
      .then(function(chatprofile){
        logger.info('chat created');
        res.status(200).send(chatprofile).end();
      })
      .catch(function(error){
          logger.error(error);
          res.send({error:error}).end();
      });
  })
    //}
};
exports.findChatMembers = function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var regidObj={};
    var registrationids=[];
    
    var query = {"createdBy.employeeid": req.params.Id } ;

    //var query = {"employee.employerid":req.params.Id}
  
    chatModel.find(query,{},function(err,chatprofile){
    if(err) {
           logger.error(err)
           return res.send(err);
       }
       for(var i=0; i< Object.keys(chatprofile).length;i++){    

         var findChatQuery = {"chatId": chatprofile[i]._id } ;
          regidObj['chatId'] = chatprofile[i]._id;
          regidObj['firstname'] = chatprofile[i].member.firstname;
          regidObj['lastname'] = chatprofile[i].member.lastname;
          regidObj['primaryphone'] = chatprofile[i].member.primaryphone;
          regidObj['email'] = chatprofile[i].member.email;
          regidObj['employerid'] = chatprofile[i].member.employerid;
          regidObj['employeeid'] = chatprofile[i].member.employeeid;
          regidObj['delivered'] = chatprofile[i].member.delivered;
          regidObj['read'] = chatprofile[i].member.read;
          regidObj['last_seen'] = chatprofile[i].member.last_seen;
          regidObj['registration_id'] = chatprofile[i].member.registration_id;

          msgModel.find(findChatQuery,{},function(err,chat){


          });

          registrationids.push(regidObj);
          regidObj = {};         
      }
       res.json(registrationids);
    });
};
exports.findMessagesByChatId = function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var query = {"chatId":req.query.chatId}

    var lteQuery;
    var gteQuery
    var toDate;
    var fromDate;
    var startTime = "T00:00:00.000Z";
    var toTime = "T23:59:00.000Z";;
    var messageDates = req.query.messageDates;

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

    messageModel.find(query,{},function(err,chatprofile){
        if(err) {
             logger.error(err)
             return res.send(err);
         }          
          res.json(chatprofile);
        }).sort({ createdAt : -1});
};
exports.saveFCMregistrationToken = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	var query = {"UserId":req.body.UserId}	

	pushMessageModel.findOne(query,function(err,deviceProfile){
	if (err) return res.send(err);
	if(deviceProfile !== null)
	{	
		var options ={upsert:true,new: true};	
		pushMessageModel.update(query,{$set:{"FCMregistrationToken":req.body.FCMregistrationToken}},options,function(err,profile){
			if (err) return res.send(err);;
			if(profile)
			{
				return res.json(profile);
			}
		});		
	}else
	{
		var FCMregToken = new pushMessageModel(req.body);
		FCMregToken.save(function(err, profile){
		if(err)
			res.send(err);
		return res.json(profile);
		});
	}
	});
};
exports.pushMessageToDevice = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    var query = {"UserId":req.body.UserId}

	pushMessageModel.findOne(query,function(err, response){
	if(err){
		return res.send(err);
	}	
	// This registration token comes from the client FCM SDKs.
	if(!response){
		return res.send("Client not registered for FCM");
	}
	var registrationToken = response.FCMregistrationToken; //"bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...";
	// var mesg= req.body.message.split(',');
	// mess = mesg[0] + ","  + mesg[1];
	// See the "Defining the message payload" section below for details
	// on how to define a message payload.
	var payload = {
	  // notification: {
	  //   title: req.body.notification.title,
	  //   body: req.body.notification.body
	  // },
	  data: {
	    message:req.body.message
	  }
	};
	// Send a message to the device corresponding to the provided
	// registration token.
	admin.messaging().sendToDevice(registrationToken, payload)
		.then(function(response) {
			res.json(response);
			//console.log("Successfully sent message:", response);
		})
		.catch(function(error) {
			//console.log("Error sending message:", error);
			res.json(error);
		});
	});
};
exports.sendMessageToDevice = function(req,res){
    var chatId = req.body.chatId;
    var author = {
    	email : req.body.author.email,
    	firstname : req.body.author.firstname,
    	lastname : req.body.author.lastname,
    	primaryphone:req.body.author.primaryphone,
    	employerid : req.body.author.employerid,
    	employeeid : req.body.author.employeeid
    }
    var messagePayload = {
    	messageType : req.body.messagePayload.messageType,
    	message : req.body.messagePayload.message,
    	receiver : {
    		email:req.body.messagePayload.receiver.email,
    		firstname:req.body.messagePayload.receiver.firstname,
    		lastname:req.body.messagePayload.receiver.lastname,
    		employerid: req.body.messagePayload.receiver.employerid,
      		employeeid: req.body.messagePayload.receiver.employeeid,
    		read:req.body.messagePayload.receiver.read,
    		delivered:req.body.messagePayload.receiver.delivered,
    		last_seen:req.body.messagePayload.receiver.last_seen,
    		registration_id : req.body.messagePayload.receiver.registration_id
    	} 
    }
	if(messagePayload.messageType === 'notification'){
		message = req.body.message;
		pushMessage(messagePayload.receiver.registration_id,message)
			.then(([pushMessage]) =>{
				logger.info('message pushed to device');
				res.send('Success');
			})
			.catch(error =>{
				logger.error(error);
			})
	}
	else{
		if(messagePayload.messageType === 'text'){
			Promise.all([saveMessageOnDb(chatId,author,messagePayload),pushMessage(messagePayload.receiver.registration_id,messagePayload.message)])
			.then(([saveMessage,pushMessage]) =>{
				logger.info('text message saved on db and pushed to device');
				res.status(200).send(saveMessage).end();
			})
			.catch(error =>{
				logger.error(error);
			})
		}
		if(messagePayload.messageType === 'image'){			
			var imgbase64 = messagePayload.message;//.split('&')[1];			
			var imgFileExt = imgbase64.split(';')[0].match(/jpeg|png|gif/)[0];
			var imgdata = imgbase64.replace(/^data:image\/\w+;base64,/, "");
			var img_filename = mongoose.Types.ObjectId() + "."+ imgFileExt; //shortid.generate() + "."+ imgFileExt;

			messagePayload.message = config.googlecloudstorage_url + bucket_name +'/'+img_filename;
			 Promise.all([uploadImageOnGoogleStorage(img_filename,imgdata),
							// .then(function(message){
							// 	pushMessages(receiver_registration_id,message)
							// 	.then(function(saveMessage){
							// 		logger.info('Image uploaded to server and image url as message pushed to device');
							// 		res.status(200).send(saveMessage).end();
							// 	})
							// })
							// .catch(function(error){
							// 	logger.error(error);
							// }),
							saveMessageOnDb(chatId,author,messagePayload)				
							// .then(function(profile){
							// 	logger.info('image url as message saved on db');
							// 	res.status(200).send(profile).end();
							// })
							// .catch(function(error){
							// 	logger.error(error);
							 // })])
							 ])
			 .then(function(message){
               	pushMessage(messagePayload.receiver.registration_id,message[0])
					.then(function(saveMessage){
						logger.info('Image uploaded to server, saved on db and message pushed to device');
						res.status(200).send(message[1]).end();
					})
            })
            .catch(function(error){
                logger.error(error);
                res.json({error:error});
            });
			// fs.writeFile(__dirname + '/../../public/images/'+shortname + "."+ ext, buf , (err) => {
			//   if (err) logger.error(err);
			//   }
			//  );
			
			// message = imgurl + 'public/images/' + shortname;

			// var upload = multer({
			// storage: storage,
			// fileFilter: function(req, file, callback) {
			// 	var ext = path.extname(file.originalname)
			// 	if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
			// 		return callback(res.end('Only images are allowed'), null)
			// 	}
			// 	callback(null, true)
			// }
			// }).single('file');
			// upload(req, res, function(err) {
			// 	res.send('File is uploaded');
			// 	logger.info(err);
			// })
		}
	}	
	
	// var payload = {
	//   data: {
	//     message:message
	//   }
	// };

	// msgModel = new messageModel({
	// 	chatId : chatId,
	// 	receiver:{email_id:receivere_mail_id},
	// 	sender:{email_id:sender_email_id},
	// 	message:message
	// //	time_created:new Date()		
	// })

	// msgModel.save(function(err,profile){
	//    if(err) {
 //             logger.error(err)
 //             return res.send(err);
 //         }	        
 //         return res.json(profile);
	// 	});	

	// Send a message to the device corresponding to the provided
	// registration token.
	// admin.messaging().sendToDevice(registrationToken, payload)
	// 	.then(function(response) {
	// 		res.json(response);
	// 		//console.log("Successfully sent message:", response);
	// 	})
	// 	.catch(function(error) {
	// 		logger.error(error);
	// 		res.json(error);
	// 	});	
};
