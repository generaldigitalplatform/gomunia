var mongoose = require('mongoose'),
	chatGroupModel = mongoose.model('ChatGroup'),
    logger = require('../../utils/logger'),
    request = require('request'),
    config = require('../config/database');

exports.createChatGroup = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var registration_ids=[];
    var notification_key;

    var notification_details={
        "operation": "create",
        "notification_key_groupname" = req.body.notification_key_groupname,
        "registration_ids" : req.body.registration_ids.split(',')
    }

    var payload = {     
        uri:config.google_fcm_notification_url,
        project_id:config.projectid,
        method: 'POST',
        form:notification_details
        headers: {'Content-Type': 'application/json',"Authorization": config.google_gdsfieldforce_web_api}   
    }
    request(payload,function(error, response, body){
        logger.info(response);
    }

    var chatGroup = new chatGroupModel({
        "notification_key_groupname" = req.body.notification_key_groupname,
        "registration_ids" : req.body.registration_ids.split(','),
        "notification_key" : notification_key
    })

	chatGroup.save(function(err,profile){
	   if(err) {
             logger.error(err)
             return res.send(err);
         }	        
         return res.json(profile);
		});
	};
exports.findChatGroupById = function(req,res){
 
};