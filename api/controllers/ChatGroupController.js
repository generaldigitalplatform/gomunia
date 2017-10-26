var mongoose         = require('mongoose'),
	chatGroupModel   = require('../models/ChatGroupModel'),
    logger           = require('../../utils/logger'),
    request          = require('request'),
    config           = require('../config/database'),
    FCMModel         = mongoose.model('FCM'),
    Promise          = require('promise'),
    shortid          = require('shortid'),
    msgModel         = require('../models/MessageModel'),
    request          = require('request'),
    fs               = require('fs'),
    moment           = require('moment'),
    admin            = require('firebase-admin'),
    serviceAccount   = require('../config/gdsfieldforce-firebase-adminsdk-m5ezh-beffa09b38');

    // admin.initializeApp({
    //       credential: admin.credential.cert(serviceAccount),
    //       databaseURL: "https://gdsfieldforce.firebaseio.com/"
    //     });

getGroupChatProfileByChatGroupName = function(chatGroupName){
    return new Promise(function(resolve,reject){
        var query = {"notification_key_groupname" : chatGroupName}
            chatGroupModel.findOne(query, function(err,chatGroupProfile){
            if(err) {
                logger.error(err);
                reject(err);              
            }
            resolve(chatGroupProfile);           
        });
    });
}
findRegistrationIds = function(req){
    return new Promise(function(resolve,reject){
        //var regidObj={};    
        var registrationids=[];
        var members = req.body.members;
        for(var i=0; i< Object.keys(members).length;i++){
               FCMModel.findOne({"UserId":members[i].emailid},function (err,response) {
              // regidObj['emailid'] =response.UserId;
              // regidObj['registration_id'] = response.FCMregistrationToken;
               registrationids.push(response.FCMregistrationToken);    
               //regidObj = {};
               if (registrationids.length === Object.keys(members).length)
               {
                    resolve(registrationids);  
               }                        

            });            
        }        
    })
}
addGroupOnDb = function(chatGroupCreatedBy,chatGroupName,notification_key,registrationids){
    return new Promise(function(resolve,reject){
        var chatGroup = new chatGroupModel({
            "createdBy":chatGroupCreatedBy,
            "chatId": shortid.generate(),
            "notification_key_groupname" : chatGroupName,
            "notification_key":notification_key,
            "notification_ids" : registrationids,
        })
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
removeGroupUserOnDb = function(chatGroupProfile,members){
  return new Promise(function(resolve,reject){
    for(var i=0; i<members.length; i++){
        var notificationIdsIndex = chatGroupProfile.notification_ids.indexOf(members[i])
        if(notificationIdsIndex == -1){
            
        }else{
            chatGroupProfile.notification_ids.splice(notificationIdsIndex,1);
        }
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
createGroupOnGCM = function(chatGroupName,registrationids){
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

exports.createChatGroup = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var registration_ids=[];
    var notification_key;

   if(req.body.chatId){
        var query = {"chatId":req.body.chatId}
        chatGroupModel.findOne(query,function(err,chatprofile){
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
        .then(function(registrationids){
            var chatGroupCreatedBy = req.body.createdBy;
            var chatGroupName = req.body.notification_key_groupname;
            createGroupOnGCM(chatGroupName,registrationids)
            .then(function(notification_key){
                var successmsg = 'ChatGroup ' + chatGroupName +' added on GCM';          
                logger.info(successmsg);

                addGroupOnDb(chatGroupCreatedBy,chatGroupName,notification_key,registrationids)
                .then(function(chatprofile){
                    var successmsg = 'ChatGroup ' + chatGroupName +' added on Db';          
                    logger.info(successmsg);
                    res.json({"success":chatprofile});    
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
                res.json({"error":errormsg});
            });
        });
    }
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
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    var chatGroupName = req.body.notification_key_groupname;
    
    findRegistrationIds(req)
    .then(function(members){           
         getGroupChatProfileByChatGroupName(chatGroupName)
        .then(function(chatGroupProfile){
            var chatGroupNotification_key = chatGroupProfile.notification_key;
            Promise.all([
                removeGroupUserOnGCM(chatGroupName,chatGroupNotification_key,members),
                removeGroupUserOnDb(chatGroupProfile,members)            
            ])
            .then(function(gcmresult,dbresult){
                logger.info('RegistrationID removed on GCM and DB');
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
