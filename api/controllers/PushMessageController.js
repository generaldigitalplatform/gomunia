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
	Promise = require('promise');

 	admin.initializeApp({
	  credential: admin.credential.cert(serviceAccount),
	  databaseURL: "https://gdsfieldforce.firebaseio.com/"
	});
    
 	var gcs = require('@google-cloud/storage')({
			  projectId: config.google_gdsfieldforce_project_id,
	 		  keyFilename: __dirname + '/../config/gdsfieldforce-firebase-adminsdk-m5ezh-beffa09b38.json'
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
		  	logger.info('file + img_filename + failed to upload to google cloud storage');
		  	reject(err);
		  })
		  .on('finish', function(req) {
		   	message = config.googlecloudstorage_url + bucket_name +'/'+img_filename;		   	
		   	logger.info('file ' + img_filename + ' uploaded to google cloud storage');
		   	resolve(message);
		  });

	})
}
saveMessage = function(chatId,sender_email_id,receivere_mail_id,message){	
	return new Promise(function(resolve, reject){	
	    msgModel = new messageModel({
		chatId : chatId,
		receiver:{email_id:receivere_mail_id},
		sender:{email_id:sender_email_id},
		message:message
		});

		msgModel.save(function(err,profile){
	    if(err) {
             logger.error(err)
             reject(err);	            
        }else{
         	logger.info('Message Saved to Db');
         	resolve(profile);
        }        
         
		});	
	});
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
			logger.info('Message pushed to device');
			resolve('Success');
		})
		.catch(function(error) {
			logger.error('Failed to push message, the reason is : '+ error);
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
			Promise.all([uploadImage(img_filename,imgdata),saveMessage(chatId,sender_email_id,receivere_mail_id,message),pushMessage(receiver_registration_id,message)])
			.then(([uploadImage,saveMessage,pushMessage]) =>{
				logger.info('Image uploaded, message saved and message pushed to device');
				res.send('Success');

			})
			.catch(error =>{
				logger.error(error);
			})
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



// $ npm install firebase-admin --save
// To use the module in your application, require it from any JavaScript file:

// var admin = require("firebase-admin");
// If you are using ES2015, you can import the module instead:

// import * as admin from "firebase-admin";
// Initialize the SDK

// Once you have created a Firebase console project and downloaded a JSON file with your service account credentials, you can initialize the SDK with this code snippet:

// NODE.JSJAVAPYTHON
// var admin = require("firebase-admin");

// var serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://<DATABASE_NAME>.firebaseio.com"
// });
// You can find your database name on the Database page of your Firebase console project.

// Note: Earlier versions of the Node.js SDK accepted a serviceAccount property instead of the credential property. Similarly, earlier versions of the Java SDK included a setServiceAccount() method instead of the setCredential() method. While these are both still permitted, they result in a deprecation warning and will be removed in the next major version of the SDKs.
// If the service account file cannot be referenced, the Admin Node.js SDK can accept the service account's individual fields inline:

// NODE.JS
// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: "<PROJECT_ID>",
//     clientEmail: "foo@<PROJECT_ID>.iam.gserviceaccount.com",
//     privateKey: "-----BEGIN PRIVATE KEY-----\n<KEY>\n-----END PRIVATE KEY-----\n"
//   }),
//   databaseURL: "https://<DATABASE_NAME>.firebaseio.com"
// });
// The Admin SDKs can alternatively be authenticated with a different credential type. For example, if you are running your code within Google Cloud Platform, you can make use of Google Application Default Credentials to automatically have the Admin SDKs themselves fetch a service account on your behalf:

// NODE.JSJAVAPYTHON
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: "https://<DATABASE_NAME>.firebaseio.com"
// });
// If you are using the Node.js Admin SDK in a Cloud Function, you can automatically initialize the SDK through the functions.config() variable:

// NODE.JS
// admin.initializeApp(functions.config().firebase);
// The Admin SDKs also provide a credential which allows you to authenticate with a Google OAuth2 refresh token:

// NODE.JSJAVAPYTHON
// var refreshToken; // Get refresh token from OAuth2 flow

// admin.initializeApp({
//   credential: admin.credential.refreshToken(refreshToken),
//   databaseURL: "https://<DATABASE_NAME>.firebaseio.com"
// });
// Warning: Certain token minting and verification functionality in the Admin SDKs is available only when authenticating with a certificate credential. However, access to the Authentication, Realtime Database, and FCM APIs works with any credential.
// You are now ready to use the Firebase Admin SDKs to accomplish the following tasks:

// Implement custom authentication
// Manage your Firebase Authentication users
// Read and write data from the Realtime Database
// Send Firebase Cloud Messaging messages
// Initialize multiple apps

// In most cases, you only have to initialize a single, default app. You can access services off of that app in two equivalent ways:

// NODE.JSJAVAPYTHON
// // Initialize the default app
// var defaultApp = admin.initializeApp(defaultAppConfig);

// console.log(defaultApp.name);  // "[DEFAULT]"

// // Retrieve services via the defaultApp variable...
// var defaultAuth = defaultApp.auth();
// var defaultDatabase = defaultApp.database();

// // ... or use the equivalent shorthand notation
// defaultAuth = admin.auth();
// defaultDatabase = admin.database();
// Some use cases require you to create multiple apps at the same time. For example, you might want to read data from the Realtime Database of one Firebase project and mint custom tokens for another project. Or you might want to authenticate two apps with separate credentials. The Firebase SDK allows you create multiple apps at the same time, each with their own configuration information.

// NODE.JSJAVAPYTHON
// // Initialize the default app
// admin.initializeApp(defaultAppConfig);

// // Initialize another app with a different config
// var otherApp = admin.initializeApp(otherAppConfig, "other");

// console.log(admin.app().name);  // "[DEFAULT]"
// console.log(otherApp.name);     // "other"

// // Use the shorthand notation to retrieve the default app's services
// var defaultAuth = admin.auth();
// var defaultDatabase = admin.database();

// // Use the otherApp variable to retrieve the other app's services
// var otherAuth = otherApp.auth();
// var otherDatabase = otherApp.database();