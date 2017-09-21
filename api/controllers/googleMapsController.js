var request = require('request'),
	reqprom = require('request-promise'),
	db = require('../config/database'),
	NodeGeocoder = require('node-geocoder');

exports.findGeoLocation = function(req,res){
    
	var lat = req.body.geo.lat; 
	var lng = req.body.geo.lng;
	var action = req.body.action;
	var startdatetime = req.body.startdatetime;
	var reachdatetime = req.body.reachdatetime;
	var canceldatetime = req.body.canceldatetime; 

	var objectId = req.body.objectId;
	var actionData;

	var putStartJob = {};

	var payload = {
		  provider: 'google',
		  // Optional depending on the providers
		  httpAdapter: 'https', // Default
		  apiKey: db.googlemapsapikey, // for Mapquest, OpenCage, Google Premier
		  formatter: null         // 'gpx', 'string', ...
	};

	var geocoder = NodeGeocoder(payload);

	geocoder.reverse({lat:lat, lon:lng}, function(err, response) {
		if(err){
			res.json(error);
		}
	// });

	// var options = {     
 //        uri:db.googlemapsapi + lat + ',' + lng,
 //        method: 'POST',
 //        json:true    
 //    };

 //    reqprom(options)
 //    	.then(function(response){
			if(response.length > 0){

	    	var address = response[0].formattedAddress;

	    	if(action==='started'){
		        	actionData = {
		        		"StartedLocation" :{
							"DateTime": startdatetime,
							"Area": address,
							"Coordinates": [lat,lng]							
		        	}
		        }
		    } else if(action === 'reached'){
		    	actionData = {
		        		"ReachedLocation" :{
							"DateTime": reachdatetime,
							"Area": address,
							"Coordinates": [lat,lng]							
		        	}
		        }
		    }else if(action === 'cancelled'){
		    	actionData = {
		        		"CancelledLocation" :{
							"DateTime": canceldatetime,
							"Area": address,
							"Coordinates": [lat,lng]							
		        	}
		        }
		    } 
	    	var putStartJob = {     
		        uri:db.job + objectId,
		        method: 'PUT',
		        form:actionData,
		        json:true,
		        headers: {'Content-Type': 'application/json',"Authorization": req.headers.authorization}   
	    	}
	    	reqprom(putStartJob)
	    		.then(function(response){	    			
	    			res.json(response);
	    		})
	    		.catch(function(error){
					res.json(error);
				})
	   		}
	   		else{
	     		res.json({message:"No locations found for the given lat and lng"});
	    	}
    		
    	})    	
    	.catch(function(error){
    		res.json(error);
    	})
};
