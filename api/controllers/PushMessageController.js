// 'use strict';

var mongoose 		 = require('mongoose'),
 	admin 			 = require('firebase-admin'),
 	serviceAccount 	 = require('../config/gdsfieldforce-firebase-adminsdk-m5ezh-beffa09b38'),
	pushMessageModel = require('../models/PushMessageModel'),
	chatModel 		 = require('../models/ChatModel'),
	messageModel 	 = require('../models/MessageModel'),
    // multer			 = require('multer'),
	//path 			 = require('path'),
	logger           = require('../../utils/logger'),
	fs 				 = require('fs'),
	shortid			 = require('shortid'),
    Storage 		 = require('@google-cloud/storage'),
	stream 			 = require('stream'),
	config           = require('../config/database'),
	Promise 		 = require('promise'),
 	gcs 			 = require('@google-cloud/storage')({
						  projectId: config.google_gdsfieldforce_project_id,
				 		  keyFilename: __dirname + '/../config/gdsfieldforce-firebase-adminsdk-m5ezh-beffa09b38.json'
						}),
 	mongoose = require('mongoose');

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


buildNewChatObject = function(req){
    return new Promise(function(resolve,reject){
        var regidObj={};    
        var registrationids=[];

        var members = req.body.members;
        for(var i=0; i< Object.keys(members).length;i++){
               FCMModel.findOne({"UserId":members[i].emailid},function (err,response) {
               regidObj['email_id'] =response.UserId;
               regidObj['registration_id'] = response.FCMregistrationToken;
               regidObj['delivered'] = false;
               regidObj['read'] = false;
               regidObj['last_seen'] ="";
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
uploadImageOnServer = function(img_filename,imgdata){
	return new Promise(function (resolve,reject){	
		fs.writeFile(__dirname + '/../../public/images/'+img_filename, buf , (err) => {
	  	if (err){

	  	}

	  	});
		 
	})
}
uploadImage = function(img_filename,imgdata){
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
pushMessages = function(receiver_registration_id,message){
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
exports.chatMessageToDevice = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    var chatId = req.body.chatId;
    // var author_email = req.body.author.email;
    // var author_firstname = req.body.author.firstname;
    // var author_lastname = req.body.author.lastname;
    // var author_employerid = req.body.author.employerid;
    
    var author = {
    	email : req.body.author.email,
    	firstname : req.body.author.firstname,
    	lastname : req.body.author.lastname,
    	primaryphone:req.body.author.primaryphone,
    	employerid : req.body.author.employerid
    }
    var messagePayload = {
    	messageType : req.body.messagePayload.messageType,
    	message : req.body.messagePayload.message,
    	receiver : {
    		email:req.body.messagePayload.receiver.email,
    		firstname:req.body.messagePayload.receiver.firstname,
    		lastname:req.body.messagePayload.receiver.lastname,
    		read:req.body.messagePayload.receiver.read,
    		delivered:req.body.messagePayload.receiver.delivered,
    		last_seen:req.body.messagePayload.receiver.last_seen,
    		registration_id : req.body.messagePayload.receiver.registration_id
    	} 
    }

    //var receivere_mail_id = req.body.receiver.emailid;
   // var receiver_registration_id = req.body.messagePayload.receiver.registration_id;

    var messageformat = req.query.messageType;
	
	if(messageformat === 'notification'){
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
		if(messageformat === 'text'){
			Promise.all([saveMessageOnDb(chatId,author,messagePayload),pushMessages(messagePayload.receiver.registration_id,messagePayload.message)])
			.then(([saveMessage,pushMessage]) =>{
				logger.info('text message saved on db and pushed to device');
				res.status(200).send(saveMessage).end();
			})
			.catch(error =>{
				logger.error(error);
			})
		}
		if(messageformat === 'image'){			
			var imgbase64 = messagePayload.message;//.split('&')[1];			
			var imgFileExt = imgbase64.split(';')[0].match(/jpeg|png|gif/)[0];
			var imgdata = imgbase64.replace(/^data:image\/\w+;base64,/, "");
			var img_filename = mongoose.Types.ObjectId() + "."+ imgFileExt; //shortid.generate() + "."+ imgFileExt;

			messagePayload.message = config.googlecloudstorage_url + bucket_name +'/'+img_filename;
			 Promise.all([uploadImage(img_filename,imgdata),
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
               	pushMessages(messagePayload.receiver.registration_id,message[0])
					.then(function(saveMessage){
						logger.info('Image uploaded to server, saved on db and image url as message pushed to device');
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
exports.chatImageMessageToDevice = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    var chatId = req.body.chatId;
    var sender_email_id = req.body.sender.emailid;
    var receivere_mail_id = req.body.receiver.emailid;
    var receiver_registration_id = req.body.receiver.registration_id;
    var messageformat = req.query.messageType;
    var message;
	
	if(messageformat === 'notification'){
		message = req.body.message;
		pushMessage(receiver_registration_id,message)
			.then(([pushMessage]) =>{
				logger.info('message pushed to device');
				res.send('Success');
			})
			.catch(error =>{
				logger.error(error);
			})
	}
	else{
		if(messageformat === 'text'){
			message =req.body.message;
			Promise.all([saveMessage(chatId,sender_email_id,receivere_mail_id,message),pushMessage(receiver_registration_id,message)])
			.then(([saveMessage,pushMessage]) =>{
				logger.info('message saved and pushed to device');
				res.send('Success');

			})
			.catch(error =>{
				logger.error(error);
			})
		}
		if(messageformat === 'image'){			
			var imgbase64 = req.body.message.split('&')[1];			
			var imgFileExt = imgbase64.split(';')[0].match(/jpeg|png|gif/)[0];
			var imgdata = imgbase64.replace(/^data:image\/\w+;base64,/, "");
			var img_filename = shortid.generate() + "."+ imgFileExt;

			message = config.googlecloudstorage_url + bucket_name +'/'+img_filename;
			Promise.all([chatImageMessageToDevice(img_filename,imgdata),saveMessage(chatId,sender_email_id,receivere_mail_id,message),pushMessage(receiver_registration_id,message)])
			.then(([uploadImage,saveMessage,pushMessage]) =>{
				logger.info('Image uploaded o server, message saved on Db and pushed to device');
				res.send('Success');

			})
			.catch(error =>{
				logger.error(error);
			})			
		}
	}	

}; 
