var request = require('request'),
	reqprom = require('request-promise'),
	db = require('../config/database'),
	NodeGeocoder = require('node-geocoder'),
	jobModel = require('../models/JobModel'),
	ObjectId = require('mongoose').Types.ObjectId;


findGeoAddress = function(lat,lng){
	return new Promise(function(resolve,reject){
			var payload = {
			  provider: 'google',
			  httpAdapter: 'https',
			  apiKey: db.googlemapsapikey, 
			  formatter: null
			};
			var geocoder = NodeGeocoder(payload);
			geocoder.reverse({lat:lat, lon:lng}, function(err, response){
			if(err){
		    reject(err);
			}
			else{
				if(response.length > 0){
					var address = response[0].formattedAddress;
					resolve(address);
				}
			}		
		})
	})
}
saveGeoAddressOnDb = function(reqBody, address){
	return new Promise(function(resolve,reject){
	var lat = reqBody.geo.lat; 
	var lng = reqBody.geo.lng;
	var jobStatus = reqBody.jobstatus;
	var jobFeedback = reqBody.jobfeedback;
	var action = reqBody.action;
	var startdatetime = reqBody.startdatetime;
	var reachdatetime = reqBody.reachdatetime;
	var canceldatetime = reqBody.canceldatetime;
	var donedatetime = reqBody.donedatetime;
	var query = {"_id":ObjectId(reqBody.objectId)};
	var options ={upsert:true,new: true};

	if(action==='started'){
        	actionData = {
        		"JobStatus":jobStatus,
        		"JobFeedback":jobFeedback,
        		"StartedLocation" :{
					"DateTime": startdatetime,
					"Area": address,
					"Coordinates": [lat,lng]							
        	}
        }
    } else if(action === 'reached'){
    	actionData = {
    			"JobStatus":jobStatus,
    			"JobFeedback":jobFeedback,
        		"ReachedLocation" :{
					"DateTime": reachdatetime,
					"Area": address,
					"Coordinates": [lat,lng]							
        	}
        }
    }else if(action === 'cancelled'){
    	actionData = {
    			"JobStatus":jobStatus,
    			"JobFeedback":jobFeedback,
        		"CancelledLocation" :{
					"DateTime": canceldatetime,
					"Area": address,
					"Coordinates": [lat,lng]							
        	}
        }
    } else if(action === 'done'){
    	actionData = {
    			"JobStatus":jobStatus,
    			"JobFeedback":jobFeedback,
        		"DoneLocation" :{
					"DateTime": donedatetime,
					"Area": address,
					"Coordinates": [lat,lng]							
        	}
        }
    }
	  jobModel.findOneAndUpdate(query,{$set:actionData},options,function(err,profile){
	  	if(err) {reject(err)}
	  	else {resolve(profile)}
  	})  
	})
}
exports.findGeoLocation = function(req,res){
	var reqBody = req.body;
	findGeoAddress(reqBody.geo.lat,reqBody.geo.lng)
		.then(function(address){
			saveGeoAddressOnDb(reqBody,address)
				.then(function(profile){
		      res.status(200).json({"user":profile});
				})
				.catch(function(err){
					res.status(500).send({"error":err}).end();
				})
		})
		.catch(function(err){
			res.status(500).send({"error":err}).end();
		})
}
// exports.findGeoLocation = function(req,res){

// 	var lat = req.body.geo.lat; 
// 	var lng = req.body.geo.lng;
// 	var jobStatus = req.body.jobstatus;
// 	var jobFeedback = req.body.jobfeedback;
// 	var action = req.body.action;
// 	var startdatetime = req.body.startdatetime;
// 	var reachdatetime = req.body.reachdatetime;
// 	var canceldatetime = req.body.canceldatetime;
// 	var donedatetime = req.body.donedatetime;
// 	var objectId = req.body.objectId;
// 	var actionData;
// 	var putStartJob = {};
// 	var payload = {
// 		  provider: 'google',
// 		  httpAdapter: 'https',
// 		  apiKey: db.googlemapsapikey, 
// 		  formatter: null
// 	};
// 	var geocoder = NodeGeocoder(payload);
// 	geocoder.reverse({lat:lat, lon:lng}, function(err, response) {
// 	if(err){
// 		return res.json(err);
// 	}
// 	if(response.length > 0){
// 	var address = response[0].formattedAddress;
// 	if(action==='started'){
//         	actionData = {
//         		"JobStatus":jobStatus,
//         		"JobFeedback":jobFeedback,
//         		"StartedLocation" :{
// 					"DateTime": startdatetime,
// 					"Area": address,
// 					"Coordinates": [lat,lng]							
//         	}
//         }
//     } else if(action === 'reached'){
//     	actionData = {
//     			"JobStatus":jobStatus,
//     			"JobFeedback":jobFeedback,
//         		"ReachedLocation" :{
// 					"DateTime": reachdatetime,
// 					"Area": address,
// 					"Coordinates": [lat,lng]							
//         	}
//         }
//     }else if(action === 'cancelled'){
//     	actionData = {
//     			"JobStatus":jobStatus,
//     			"JobFeedback":jobFeedback,
//         		"CancelledLocation" :{
// 					"DateTime": canceldatetime,
// 					"Area": address,
// 					"Coordinates": [lat,lng]							
//         	}
//         }
//     } else if(action === 'done'){
//     	actionData = {
//     			"JobStatus":jobStatus,
//     			"JobFeedback":jobFeedback,
//         		"DoneLocation" :{
// 					"DateTime": donedatetime,
// 					"Area": address,
// 					"Coordinates": [lat,lng]							
//         	}
//         }
//     }  
// 	var putStartJob = {     
//         uri:db.job + objectId,
//         method: 'PUT',
//         form:actionData,
//         json:true,
//         headers: {'Content-Type': 'application/json',"Authorization": req.headers.authorization}   
// 	}
// 	reqprom(putStartJob)
// 		.then(function(response){	    			
// 			res.json(response);
// 		})
// 		.catch(function(error){
// 			res.json(error);
// 		})
// 		}
// 		else{
//  		res.json({message:"No locations found for the given lat and lng"});
// 	}	
// })  
// };

	