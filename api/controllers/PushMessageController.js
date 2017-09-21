var mongoose 		 = require('mongoose'),
 	admin 			 = require('firebase-admin'),
 	serviceAccount 	 = require('../config/gdsfieldforce-firebase-adminsdk-m5ezh-beffa09b38')
	pushMessageModel = require('../models/PushMessageModel');

	admin.initializeApp({
	  credential: admin.credential.cert(serviceAccount),
	  databaseURL: "https://gdsfieldforce.firebaseio.com/"
	});

//var serverkey = 'AAAAUGGsxGs:APA91bF1qVPPcbsSvYAbtcJzslTVFUEk3hpZOJWwbR_Rc8MBDZXpH8Bxf4Rn-SWXX4TxpMGF-3YWHDNC97i-wIxC4qPDq_htpsNr-eKTjOMKf7jftuKQD_nTOc_ZVIxNg7KscviAZUj8';  
//fcm controller
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
		res.send(err);
	}
	
	// This registration token comes from the client FCM SDKs.
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
			console.log("Successfully sent message:", response);
		})
		.catch(function(error) {
			console.log("Error sending message:", error);
			res.json(error);
		});
	});

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