// 'use strict';

var mongoose 		 = require('mongoose'),
 	admin 			 = require('firebase-admin'),
 	serviceAccount 	 = require('../config/gdsfieldforce-firebase-adminsdk-m5ezh-beffa09b38'),
	pushMessageModel = require('../models/PushMessageModel'),
	chatModel 		 = require('../models/ChatModel'),
	chatGroupModel   = require('../models/ChatGroupModel'),
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
    async			 = require('async'),
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
pushMessage = function(createdAt,chatId,author,messagePayload){
	return new Promise(function(resolve,reject){
		// var payload = {
		//   data: {
		//     message:message
		//   }
		// };
	// var from = {
 //    	email : req.body.author.email,
 //    	firstname : req.body.author.firstname,
 //    	lastname : req.body.author.lastname,
 //    	primaryphone:req.body.author.primaryphone,
 //    	employerid : req.body.author.employerid,
 //    	employeeid : req.body.author.employeeid,
 //    	registration_id : req.body.author.registration_id
 //    	}
 //    var to = {
 //    		email:req.body.messagePayload.receiver.email,
 //    		firstname:req.body.messagePayload.receiver.firstname,
 //    		lastname:req.body.messagePayload.receiver.lastname,
 //    		primaryphone:req.body.messagePayload.receiver.primaryphone,
 //    		employerid: req.body.messagePayload.receiver.employerid,
 //      		employeeid: req.body.messagePayload.receiver.employeeid,      		
 //    		registration_id : req.body.messagePayload.receiver.registration_id,
 //    		message : req.body.messagePayload.message   	
 //   		}

var message = "{"+ "\"type\":"+ '"' + "chat" + '"'  + ",\"createdAt\":"+ '"' + createdAt + '"' + ",\"author.lastname\":"+ '"' + author.lastname + '"'  + ", \"author.firstname\":"+ '"' +author.firstname + '"'  + ", \"chatId\":"+ '"' +chatId + '"'  + " , \"messagePayload.messageType\":"+ '"' +messagePayload.messageType + '"'  + " , \"author.employeeid\":"+ '"' +author.employeeid + '"'  + ", \"author.employerid\":"+ '"' +author.employerid + '"'  + ", \"author.email\":"+ '"' +author.email+ '"'  + ", \"author.primaryphone\":"+ '"' +author.primaryphone+ '"'  + ", \"messagePayload.message\":"+ '"' +messagePayload.message + '"'+"" + "}";

//var message = "{"+ "\"type\":"+ '"' + "chat" + '"'  + ",\"author.lastname\":"+ '"' + author.lastname + '"'  + ", \"author.firstname\":"+ '"' +author.firstname + '"'  + ", \"chatId\":"+ '"' +chatId + '"'  + " , \"messagePayload.messageType\":"+ '"' +messagePayload.messageType + '"'  + " , \"author.employeeid\":"+ '"' +author.employeeid + '"'  + ", \"author.employerid\":"+ '"' +author.employerid + '"'  + ", \"author.email\":"+ '"' +author.email+ '"'  + ", \"author.primaryphone\":"+ '"' +author.primaryphone+ '"'  + ", \"messagePayload.message\":"+ '"' +messagePayload.message + '"'+"" + "}";

//var str1 = "efseesd";

 //var str = "{"+ "\"type\":"+ '"' + "chat" + '"'  + ",\"messagePayload.receiver.lastname\":"+ '"' + messagePayload.receiver.lastname + '"'  + ", \"messagePayload.receiver.firstname\":"+ '"' +messagePayload.receiver.firstname + '"'  + ", \"chatId\":"+ '"' +chatId + '"'  + " , \"messagePayload.messageType\":"+ '"' +messagePayload.messageType + '"'  + " , \"messagePayload.receiver.employeeid\":"+ '"' +messagePayload.receiver.employeeid + '"'  + ", \"messagePayload.receiver.employerid\":"+ '"' +messagePayload.receiver.employerid + '"'  + ", \"messagePayload.receiver.email\":"+ '"' +messagePayload.receiver.email+ '"'  + ", \"messagePayload.receiver.primaryphone\":"+ '"' +messagePayload.receiver.primaryphone+ '"'  + ", \"messagePayload.message\":"+ '"' +messagePayload.message + '"'+"" + "}" + '"';

 //+ "}"
// "{"+
 		var payload = {
 			data:{
 				message:message
 			}
 		}
	   	// var payload = {
	   	// 	data:{
	   	// 	"chatId":chatId,
	   	// 	// "author.email" : author.email,
	   	// 	// "author.firstname" : author.firstname,
	    // 	// "author.lastname" : author.lastname,
	    // 	// "author.primaryphone":author.primaryphone,
	    // 	// "author.employerid" : author.employerid,
	    // 	// "author.employeeid" : author.employeeid,
    	// 	// "author.registration_id": author.registration_id,
    	// 	"messagePayload.messageType":messagePayload.messageType,
    	// 	"messagePayload.message":messagePayload.message,
	    // 	'messagePayload.receiver.email' : messagePayload.receiver.email,
	    // 	'messagePayload.receiver.firstname' : messagePayload.receiver.firstname,
	    // 	'messagePayload.receiver.lastname' : messagePayload.receiver.lastname,
	    // 	'messagePayload.receiver.primaryphone':messagePayload.receiver.primaryphone,
	    // 	'messagePayload.receiver.employerid' : messagePayload.receiver.employerid,
	    // 	'messagePayload.receiver.employeeid' : messagePayload.receiver.employeeid
	    // 	//'messagePayload.receiver.registration_id' : messagePayload.receiver.registration_id,
	    // 	//'messagePayload.receiver.read' : messagePayload.receiver.read,
	    // 	//'messagePayload.receiver.delivered' : messagePayload.receiver.delivered,
	    // 	//'messagePayload.receiver.last_seen' : messagePayload.receiver.last_seen
	   	// 	}
	   	// }
	   	var registrationToken = messagePayload.receiver.registration_id;
		logger.info('registrationToken of  ' + messagePayload.receiver.email + 'is' + registrationToken)			

		admin.messaging().sendToDevice(registrationToken, payload)
		.then(function(response) {
			logger.info('message successfully sent to ' + messagePayload.receiver.email + 'by' + author.email)			
			resolve(response);
		})
		.catch(function(error) {
			logger.error('message failed sent to ' + messagePayload.receiver.email + 'by' + author.email)			
			reject(error);
		});
	})	
}
buildChatObject = function(createdBy,member){
  return new Promise(function(resolve,reject){
    var regidObj = {};
    var memObj = [];
    var chatProfile = [];

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
    var isActive = false;
    var chatMembersObj = [createdByObj,memberObj];

    // FCMModel.findOne({"UserId":memberObj.email},function (error,response){ 
    //   if(error){
    //     reject(errror)    
    //   }              
    //   else if(response){
    //     memberObj.registration_id = response.FCMregistrationToken;
    //     regidObj['createdBy'] = createdByObj;
    //     regidObj['member'] = memberObj;
    //     resolve(regidObj);
    //   }
    //   else{
    //     reject(response)    
    //   }      
    // });   

      var responseCount = 0;
      async.eachSeries(chatMembersObj,function(chatMemberObj,callback) {
        FCMModel.find({"UserId":chatMemberObj.email}, function (err, response) {
        	if(chatMemberObj.email === createdByObj.email ){
        		createdBy.registration_id = response[0].FCMregistrationToken;
        	}else if(chatMemberObj.email === memberObj.email ){
        		member.registration_id = response[0].FCMregistrationToken;
        	}	        
	    	//memberObjs.registration_id = response[0].FCMregistrationToken;
		   // registration_ids.push(response[0].FCMregistrationToken); 	       
		    responseCount++;

		    if (responseCount === Object.keys(chatMembersObj).length)
	        {	
	       		regidObj['createdBy'] = createdByObj;
	       		regidObj['member'] = memberObj;
	       		regidObj['isActive'] = false;

	        	//chatProfile.push(regidObj);
	        	var resObj = {createdBy,member,isActive}
	            resolve(resObj);  
	        }
            callback(err)
        });
    },function(err) {
        if (err) {
        	reject(err);
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
getGroupChatProfileByChatGroupName = function(chatGroupName){
    return new Promise(function(resolve,reject){
        var query = {"chatGroupName" : chatGroupName}
            chatGroupModel.findOne(query, function(err,chatGroupProfile){
            if(err) {
                logger.error(err);
                reject(err);              
            }
            resolve(chatGroupProfile);           
        });
    });
}
getDeviceRegistrationIdsOnDb = function(chatGroupProfile){
    return new Promise(function(resolve,reject){
        var registration_ids = [];
       // var members = chatGroupProfile.members;
        for(var i=0; i<chatGroupProfile.length; i++){
        	registration_ids.push(chatGroupProfile[i].registration_id);
        	if (registration_ids.length === Object.keys(chatGroupProfile).length)
	        {
	        	resolve(registration_ids);  
	        }        	
        }  
    });
}
buildChatGroupObject = function(createdBy,members,chatGroupName){
  return new Promise(function(resolve,reject){
    var chatGroupProfile = [];
    var registration_ids = [];
    var member = [];

    var regidObj = {};
    regidObj['chatGroupName'] = chatGroupName; 
    var createdByObj = {
      email : createdBy.email,
      firstname : createdBy.firstname,
      lastname : createdBy.lastname,
      primaryphone : createdBy.primaryphone,
      employerid : createdBy.employerid,
      employeeid : createdBy.employeeid,
    };
    regidObj['createdBy'] = createdByObj; 

    async.eachSeries(members,function(memberObj,callback) {
    	var memberObjs = {
		      email: memberObj.email,
		      firstname: memberObj.firstname,
		      lastname: memberObj.lastname,
		      primaryphone: memberObj.primaryphone,
		      employerid: memberObj.employerid,
		      employeeid: memberObj.employeeid,
	    	};
        FCMModel.find({"UserId":memberObjs.email}, function (err, response) {	        
	    	memberObjs.registration_id = response[0].FCMregistrationToken;
		    registration_ids.push(response[0].FCMregistrationToken); 	       
		    member.push(memberObjs);

		    if (registration_ids.length === Object.keys(members).length)
	        {	
	       		regidObj['members'] = member;
	        	chatGroupProfile.push(regidObj);
	        	chatGroupProfile.push(registration_ids);
	            resolve(chatGroupProfile);  
	        }
            callback(err)
        });
    },function(err) {
        if (err) throw err;
        //console.log("done");
    });


 //    for(var i=0; i< Object.keys(members).length;i++){
 //    	var memberObj = {
	//       email: members[i].email,
	//       firstname: members[i].firstname,
	//       lastname: members[i].lastname,
	//       primaryphone: members[i].primaryphone,
	//       employerid: members[i].employerid,
	//       employeeid: members[i].employeeid,
 //    	};
	//     FCMModel.findOne({"UserId":memberObj.email},function (error,response){ 
	//       if(error){
	//         reject(errror)    
	//       }              
	//       else if(response){
	//         memberObj.registration_id = response.FCMregistrationToken;
	//         registration_ids.push(response.FCMregistrationToken); 	       
	//         member.push(memberObj);
	//        // memberObj = {}
	//         if (registration_ids.length === Object.keys(members).length)
	//         {	
	//        		regidObj['members'] = member;
	//         	chatGroupProfile.push(regidObj);
	//         	chatGroupProfile.push(registration_ids);
	//             resolve(chatGroupProfile);  
	//         } 
	//       }	          
	//     });     
	// }
  })
}
findRegistrationIds = function(members){
    return new Promise(function(resolve,reject){
        var registrationids=[];
        for(var i=0; i< Object.keys(members).length;i++){
               FCMModel.findOne({"UserId":members[i].emailid},function (err,response) {
               registrationids.push(response.FCMregistrationToken);    
               if (registrationids.length === Object.keys(members).length)
               {
                    resolve(registrationids);  
               }                        

            });            
        }        
    })
}
addGroupOnDb = function(chatGroupProfile){
    return new Promise(function(resolve,reject){
        var chatGroup = new chatGroupModel(chatGroupProfile);
        chatGroup.save(function(err,chatprofile){
            if(err) {
                reject(err)
            }
            else{
                resolve(chatprofile);
            }
        });
    })   
}
addGroupUserOnDb = function(chatGroupProfile,members){
  return new Promise(function(resolve,reject){
    for(var i=0; i<members.length; i++){
        chatGroupProfile.notification_ids.push(members[i])
    }
    chatGroupProfile.save(function(error){
        if(error){
            reject(error);
            // logger.info('failed to add Members into the ChatGroup '+ req.body.notification_key_groupname)          
            // response.status(500).send({error:error});
        }
        else{
            resolve();
            // logger.info('Members added into the ChatGroup '+ req.body.notification_key_groupname)          
            // response.status(200).send("Success");
        }
    })
  })    
}
removeGroupUserOnDb = function(chatGroupName,registrationids){
	return new Promise(function(resolve,reject){
   	var ids = registrationids;

	var query = {"chatGroupName":chatGroupName};
    async.eachSeries(registrationids,function(registrationid,callback) {
    	
        chatGroupModel.update(query, { "$pull" : { "members" : { "registration_id" :  registrationid } } } , { "multi" : true },function (err, response) {	        
	        if (registrationids.length === ids.length)
	        {		       		
	            resolve();  
	        }
            callback(err)
        });
    },function(err) {
        //if (err) throw err;
        //console.log("done");
    });
  })
} 
createGroupOnGCM = function(chatGroupName,registrationids){
    return new Promise(function(resolve,reject){        
        const options = {
            method: 'POST',
            uri: 'https://android.googleapis.com/gcm/notification',
            headers: {
               'Authorization': 'key=' + config.google_gdsfieldforce_server_key,
               'project_id': config.google_gdsfieldforce_project_id,
               'Accept':'application/json'
            },
            body: {
               operation: 'create',
               notification_key_name: chatGroupName,
               registration_ids:registrationids
            },
            json: true
        };
        request(options,function(error, response, body){                
            if(error){
               reject(error);
            }
            if(body.error){
                reject(body.error); 
            }
            if(body.notification_key){
                resolve(body.notification_key);              
            }
        })
    })   
}
addGroupUserOnGCM = function(chatGroupName,chatGroupNotification_key,members){
    return new Promise(function(resolve,reject){
        var registration_ids=[];
        const options = {
            method: 'POST',
            uri: 'https://android.googleapis.com/gcm/notification',
            headers: {
               'Authorization': 'key=' + config.google_gdsfieldforce_server_key,
               'project_id': config.google_gdsfieldforce_project_id,
               'Accept':'application/json'
            },
            body: {
               operation: 'add',
               notification_key_name: chatGroupName,
               notification_key: chatGroupNotification_key,
               registration_ids:members
            },
            json: true
        };
        request(options,function(error, response, body){                
            if(error){
               // logger.error(error);
                reject(error);
               // response.send({"error":error});
            }
            if(body.error){
                reject(body.error);
              //  logger.error(body.error);
              //  response.send(body.error);
            }
            if(body.notification_key) {
                resolve(body.notification_key);
            }            
        });
    })   
}
removeGroupUserOnGCM = function(chatGroupName,chatGroupNotification_key,members){
    return new Promise(function(resolve,reject){
        var registration_ids=[];
        const options = {
            method: 'POST',
            uri: 'https://android.googleapis.com/gcm/notification',
            headers: {
               'Authorization': 'key=' + config.google_gdsfieldforce_server_key,
               'project_id': config.google_gdsfieldforce_project_id,
               'Accept':'application/json'
            },
            body: {
               operation: 'remove',
               notification_key_name: chatGroupName,
               notification_key: chatGroupNotification_key,
               registration_ids:members
            },
            json: true
        };
        request(options,function(error, response, body){                
            if(error){
               // logger.error(error);
                reject(error);
               // response.send({"error":error});
            }
            if(body.error){
                reject(body.error);
              //  logger.error(body.error);
              //  response.send(body.error);
            }
            if(body.notification_key) {
                resolve(body.notification_key);
            }            
        });
    })   
}
checkWhoIscreatedAndWhoIsMember = function(chatProfile,createdBy,member){
   //	return new Promise(function(resolve,reject){
		var chatList = [];
		if(chatProfile.createdBy.employeeid === createdBy.employeeid ){
			chatProfile['member'] = member;
			chatProfile['createdBy'] = createdBy;	 	 
		}if(chatProfile.member.employeeid === member.employeeid){
			chatProfile['createdBy'] = createdBy;
			chatProfile['member'] = member;	 
		} 
		if(chatProfile.createdBy.employeeid === member.employeeid ){
			chatProfile['member'] = createdBy;
			chatProfile['createdBy'] = member;	 	 
		}if(chatProfile.member.employeeid === createdBy.employeeid){
			chatProfile['createdBy'] = member;
			chatProfile['member'] = createdBy;	 
		}
		return chatProfile;
	
		// for(var i=0; i< memObj.length; i++){
	 //        		if(memObj[i].member.employeeid === req.params.Id ){
	 //        			response[i]['chatId'] = memObj[i]._id;
	 //        			response[i]['member'] = memObj[i]['createdBy'];
	 //        			response[i]['createdBy'] = memObj[i]['member'];
	 //        			response[i]['message'] = memObj[i]['message'];
	 //        		//	chatList.push(member);	 	 
	 //        		}if(memObj[i].createdBy.employeeid === req.params.Id){
	 //        			response[i]['chatId'] = memObj[i]._id;
	 //        			response[i]['member'] = memObj[i]['member'];
	 //        			response[i]['createdBy'] = memObj[i]['createdBy'];
	 //        			response[i]['message'] = memObj[i]['message'];
	 //        		//	chatList.push(author);	 
	 //        		}
	 //        	}
}
checkIfChatCreated = function(createdBy,member){
	//query = {$and: [{"member.email":member.email},{"createdBy.email":createdBy.email}]};
	return new Promise(function(resolve,reject){
	// var query = {$or:[{$and: [{"member.email":member.email},{"createdBy.email":createdBy.email}]},
	// {$and: [{"createdBy.email":member.email},{"member.email":createdBy.email}]}]};	

	// chatModel.find({},function(err,chatprofile){
	// 	if (err) {
	// 		reject(err);
	// 	}
	// 	if(chatprofile.length == 0)
	// 	{			
	// 		resolve(false);

	// 	}else{
	// 		resolve(chatprofile);
	// 	}
	// });


		var queryies = [{$and: [{"member.email":member.email},{"createdBy.email":createdBy.email}]}
						,{$and: [{"member.email":createdBy.email},{"createdBy.email":member.email}]}
					   ];
		var createdbyQuery = {$and: [{"member.email":member.email},{"createdBy.email":createdBy.email}]}
		var memberbyQuery = {$and: [{"member.email":createdBy.email},{"createdBy.email":member.email}]}

		var responseCount = 0;
		var chatCreatedByMember = [];

	   // async.eachSeries(queryies,function(query,callback) {
        chatModel.find(createdbyQuery, function (err, response) {
	    	//memberObjs.registration_id = response[0].FCMregistrationToken;
		   // registration_ids.push(response[0].FCMregistrationToken); 	       
		    if(response.length !== 0){
		    //	memObj.push(response);
		    	chatCreatedByMember.push(response[0]);
		    }//else{
	    	chatModel.find(memberbyQuery, function (err, response) {

	    	if(response.length !== 0){
		    	chatCreatedByMember.push(response[0]);
		    }//else{
		    	resolve(chatCreatedByMember);
		   //}
	    	})
		  //  }
		    // responseCount++;
		    // if (responseCount === Object.keys(queryies).length)
	     //    {
	     //    	if(memObj.length === 0){
	     //    		 resolve(memObj);
	     //    		}else{
	     //    			var mergedObj = Object.assign.apply(Object, memObj);
	     //    			var obj = mergedObj.reduce(function(acc, cur, i) {
						//   acc[i] = cur;
						//   // return acc;
						//   resolve(cur);
						// }, {});
	     //    		}
	     //    }
      //       callback(err)
        });
    // },function(err) {
    //     if (err) {
    //     	reject(err);
    //     }
       
    // });

  });
}
exports.deleteChat = function(req,res){

  var query = {"_id":req.params.Id};
  
  chatModel.findOneAndRemove(query,function(err,profile){
    if (err) return res.send(err);;
    if(profile)
    {
      res.json(profile);
    }else{
      res.json({});
    }
  });

}
exports.createChat = function(req,res){
  var createdBy = req.body.createdBy;
  var member =  req.body.member;

  checkIfChatCreated(createdBy,member)
  .then(function(chatprofile){
  	if(chatprofile.length !== 0){
  		//chatProfile = checkWhoIscreatedAndWhoIsMember(chatprofile[0],createdBy,member)
  		//.then(function(chatProfile){
  			res.status(200).send(chatprofile[0]).end();
  	//	})
  	}else{
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
  	}
  });


    //}
};
exports.findChatMembers = function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var regidObj={};
    var registrationids=[];
    var memObj = [];
    var message = {
    	lastmessage:String,
    	createdAt:Date
    };
    var response = [];

	var query = {$or:[{"createdBy.employeeid":req.params.Id},{"member.employeeid":req.params.Id}]};
    chatModel.find(query,function(err,chatprofiles){
	    if(err) {
	        logger.error(err)
	  		res.status(500).send(err).end();
	    }
	    if(chatprofiles.length === 0) {
	       	res.status(500).send(chatprofiles).end();
	    }
	    else if(chatprofiles){
	    	if(chatprofiles.length !== 0){

		      var responseCount = 0;
		      async.eachSeries(chatprofiles,function(chatprofile,callback) {
		      messageModel.find({"chatId":chatprofile._id},function(err,response){
			      	if(response.length !== 0){
				      		if(response[0].messagePayload.messageType === 'text'){ 
					    	message.lastmessage = response[0].messagePayload.message;
						    }else if(response[0].messagePayload.messageType === 'image'){
						    message.lastmessage = 'Photo';
						    }
					    	message.createdAt = response[0].createdAt;
					    	//message["message"] = message;
					    	chatprofile["message"] = message;
					    	//chatprofile["createdBy"] = response[0].createdBy;
					    	memObj.push(chatprofile);
				    }
				    responseCount++;
				    if (responseCount === Object.keys(chatprofiles).length){			     		        	
    						if(memObj.length === 0){
    							res.status(200).send(memObj).end();
    						}
    			        	
    						else{    							
    			        	var response = [];
                     	for(var i=0; i< memObj.length; i++){
        			          var chatObj = {
        							  "chatId":Object,
        			        	"member":{},
        			        	"createdBy":{},
        			        	"message":String
        			        	};
    			        		if(memObj[i].member.employeeid === req.params.Id ){
    			        			chatObj.chatId = memObj[i]._id;
    			        			chatObj.member = memObj[i]['createdBy'];
    			        			chatObj.createdBy = memObj[i]['member'];
    			        			chatObj.message = memObj[i]['message'];
    			        			response.push(chatObj);	 	 
    			        		}if(memObj[i].createdBy.employeeid === req.params.Id){
    			        			chatObj.chatId = memObj[i]._id;
    			        			chatObj.member = memObj[i]['member'];
    			        			chatObj.createdBy = memObj[i]['createdBy'];
    			        			chatObj.message = memObj[i]['message'];
    			        			response.push(chatObj);	 
    			        		}
    			        	}
    			          res.status(200).send(response).end();
    						}
			  
			        }
			      	 callback(err);
			    	}).sort({_id:-1}).limit(1)
				    },function(err) {
				        if (err) {
				        	reject(err);
				        }
				       
				    });	
		    	
	    	}
	  		
	    }
	});
}; 
exports.findMessagesByChatId = function(req,res){

    var query = {"chatId":req.query.chatId}

    var lteQuery;
    var gteQuery
    var toDate;
    var fromDate;
    var startTime = "T00:00:00.000Z";
    var toTime = "T23:59:00.000Z";;
    //var messageDates = req.query.messageDates;
    var limit = Number(req.query.limit);
    var skip = Number(req.query.skip);
    
   // gteQuery = moment(new Date()).format("YYYY-MM-DD")+startTime;
   // lteQuery = moment(new Date()).format("YYYY-MM-DD")+toTime;
    //query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}

    // if(messageDates === '0') {
    //   gteQuery = moment(new Date()).format("YYYY-MM-DD")+startTime;
    //   lteQuery = moment(new Date()).format("YYYY-MM-DD")+toTime;
    //   query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
    // }
    // else if(messageDates === '1') {
    
    //   var today = new Date();
    //   var yesterday = new Date(today);
    //   yesterday.setDate(today.getDate()-1);

    //   gteQuery = moment(yesterday).format("YYYY-MM-DD")+startTime;
    //   lteQuery = moment(yesterday).format("YYYY-MM-DD")+toTime;

    //   query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
    // }
    // else if(messageDates === '2') {  

    //   gteQuery = moment().startOf('isoweek').format("YYYY-MM-DD")+startTime;
    //   lteQuery =  moment().endOf('isoweek').format("YYYY-MM-DD")+toTime;
    //   query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
    // }
    // else if(messageDates === '3') {  

    //   gteQuery = moment().subtract(1, 'weeks').startOf('isoweek').format("YYYY-MM-DD")+startTime;
    //   lteQuery =  moment().subtract(1, 'weeks').endOf('isoweek').format("YYYY-MM-DD")+toTime;
    //   query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
    // }
    // else if(messageDates === '4') {
    
    //   gteQuery = moment().startOf('month').format("YYYY-MM-DD")+startTime;
    //         lteQuery   = moment().endOf('month').format("YYYY-MM-DD")+toTime;  
    //   query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
    // }
    // else if(messageDates === '5') {

    //   gteQuery = moment().subtract(1, 'months').startOf('month').format("YYYY-MM-DD")+startTime;
    //   lteQuery = moment().subtract(1, 'months').endOf('month').format("YYYY-MM-DD")+toTime;
    //   query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
    // }
    // else if(messageDates === '6') {

    //   gteQuery = moment().startOf('year').format("YYYY-MM-DD")+startTime;
    //       lteQuery   = moment().endOf('year').format("YYYY-MM-DD")+toTime; 
    //   query["createdAt"] = {$gte:gteQuery,$lte:lteQuery}
    // }

    messageModel.find(query,function(err,chatprofile){
        if(err) {
             logger.error(err)
             return res.send(err);
         }          
          res.json(chatprofile);
        }).sort({ createdAt : -1}).limit(limit).skip(skip);
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
				chatProfile = [];

				var query_find_authorreg_id = {"createdBy.email":req.body.UserId}
				var query_find_receiverreg_id = {"member.email":req.body.UserId}

				chatModel.updateMany(query_find_authorreg_id,{$set:{"createdBy.registration_id":req.body.FCMregistrationToken}},function(err,profile){
					if(err){
						//console.log('error')
					}
					if(profile){
						//console.log('profiles updated' + profile)
					}
			})

				chatModel.updateMany(query_find_receiverreg_id,{$set:{"member.registration_id":req.body.FCMregistrationToken}},function(err,profile){
				if(err){
					//console.log('error')
				}
				if(profile){
					//console.log('profiles updated' + profile)
				}
			})

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
    var createdAt = new Date().toISOString();
    var chatId = req.body.chatId;
    var author = req.body.author;
    var messagePayload = req.body.messagePayload;

    // var author = {
    // 	email : req.body.author.email,
    // 	firstname : req.body.author.firstname,
    // 	lastname : req.body.author.lastname,
    // 	primaryphone:req.body.author.primaryphone,
    // 	employerid : req.body.author.employerid,
    // 	employeeid : req.body.author.employeeid,
    // 	registration_id : req.body.author.registration_id
    // }
    // var messagePayload = {
    // 	messageType : req.body.messagePayload.messageType,
    // 	message : req.body.messagePayload.message,
    // 	receiver : {
    // 		email:req.body.messagePayload.receiver.email,
    // 		firstname:req.body.messagePayload.receiver.firstname,
    // 		lastname:req.body.messagePayload.receiver.lastname,
    // 		primaryphone:req.body.messagePayload.receiver.primaryphone,
    // 		employerid: req.body.messagePayload.receiver.employerid,
    //   		employeeid: req.body.messagePayload.receiver.employeeid,
    // 		read:req.body.messagePayload.receiver.read,
    // 		delivered:req.body.messagePayload.receiver.delivered,
    // 		last_seen:req.body.messagePayload.receiver.last_seen,
    // 		registration_id : req.body.messagePayload.receiver.registration_id
    // 	} 
    // }
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
			Promise.all([saveMessageOnDb(chatId,author,messagePayload),pushMessage(createdAt,chatId,author,messagePayload)])
			//Promise.all([saveMessageOnDb(chatId,author,messagePayload),pushMessage(messagePayload.receiver.registration_id,messagePayload.message)])
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
               	pushMessage(createdAt,chatId,author,messagePayload)
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
};
exports.createChatGroup = function(req,res){
    var createdBy = req.body.createdBy;
  	var members =  req.body.members;
	var chatGroupName = req.body.chatGroupName;

	// if(req.body.chatId){
 //        var query = {"chatId":req.body.chatId}
 //        chatGroupModel.findOne(query,function(err,chatprofile){
 //            if(err){
 //                 logger.error(err)
 //                 res.send(err);
 //            }else{           
 //            res.json(chatprofile);
 //            }
 //        });
 //    }
 //    else{
        buildChatGroupObject(createdBy,members,chatGroupName)
        .then(function(chatGroupProfile){
            createGroupOnGCM(chatGroupName,chatGroupProfile[1])
            .then(function(notification_key){
                var successmsg = 'ChatGroup ' + chatGroupName +' added on GCM';          
                logger.info(successmsg);
                chatGroupProfile[0].chatGroupKey = notification_key;

                addGroupOnDb(chatGroupProfile[0])
                .then(function(chatprofile){
                    var successmsg = 'ChatGroup ' + chatGroupName +' added on Db';          
                    logger.info(successmsg);
                    res.status(200).send(chatprofile).end(); 
                })
                .catch(function(error){
                    var errormsg = 'ChatGroup ' + chatGroupName +' failed to add on Db as the ' + error;                   
                    logger.error(errormsg)    
                    res.json({"error":errormsg});
                });
            })
            .catch(function(error){
                var errormsg = 'ChatGroup ' + chatGroupName +' failed to add on GCM as the ' + error;                    
                logger.error(errormsg) 
                res.status(500).send({"error":errormsg}).end();    
            });
        });
  //  }
}          
exports.addUsersToChatGroup = function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    var chatGroupName = req.body.notification_key_groupname;
    
    findRegistrationIds(req)
    .then(function(members){           
         getGroupChatProfileByChatGroupName(chatGroupName)
        .then(function(chatGroupProfile){
            var chatGroupNotification_key = chatGroupProfile.notification_key;
            Promise.all([
                addGroupUserOnGCM(chatGroupName,chatGroupNotification_key,members),
                addGroupUserOnDb(chatGroupProfile,members)            
            ])
            .then(function(gcmresult,dbresult){
                logger.info('RegistrationID added on GCM and DB');
                res.json('Suscess');
            })
            .catch(function(error){
                logger.error(error);
                res.json({error:error});
            });
        }) 
        .catch(function(error){
            logger.error(error);
            res.json({error:error});
        });
    });
} 
exports.removeUsersFromChatGroup = function(req,res){
  
   var memRegIds = req.body.members;
   var registration_ids = [];
   
   for(var i=0; i<memRegIds.length;i++){
    registration_ids.push(memRegIds[i])
   }
 // var registration_ids =  req.body.members;
	var chatGroupName = req.body.chatGroupName;
	var chatGroupNotification_key = req.body.chatGroupKey;

 //   getDeviceRegistrationIdsOnDb(members)
    // buildChatGroupObject(createdBy,members,chatGroupName)
  //  .then(function(registration_ids){           
        // getGroupChatProfileByChatGroupName(chatGroupName)
        //.then(function(chatGroup){
           // var chatGroupNotification_key = chatGroup.chatGroupKey;
            Promise.all([
                removeGroupUserOnGCM(chatGroupName,chatGroupNotification_key,registration_ids),
                removeGroupUserOnDb(chatGroupName,registration_ids)            
            ])
            .then(function(gcmresult,dbresult){
                logger.info('RegistrationID removed on GCM and DB');
                res.json('Suscess');
            })
            .catch(function(error){
                logger.error(error);
                res.json({error:error});
            });
    //    }) 
        // .catch(function(error){
        //     logger.error(error);
        //     res.json({error:error});
        // });
   // });
}     
