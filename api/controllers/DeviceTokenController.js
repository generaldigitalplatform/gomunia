var mongoose = require('mongoose'),
	deviceTokenModel = mongoose.model('DeviceToken');
var ObjectId = require('mongoose').Types.ObjectId;

exports.createDeviceToken = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	var query = {"UserId":req.body.UserId}	

	deviceTokenModel.findOne(query,function(err,deviceProfile){
		if (err) return res.send(err);
		if(deviceProfile !== null)
		{	
			var options ={upsert:true,new: true};	
			deviceTokenModel.update(query,{$set:{"FCMRegistrationToken":req.body.FCMRegistrationToken}},options,function(err,profile){
				if (err) return res.send(err);;
				if(profile)
				{
					return res.json(profile);
				}
			});		
		}else
		{
			var deviceToken = new deviceTokenModel(req.body);
			deviceToken.save(function(err, profile){
			if(err)
				res.send(err);
			return res.json(profile);
			});
		}
	});

	// var deviceToken = new deviceTokenModel(req.body);
	// deviceToken.save(function(err, profile){
	// if(err)
	// 	res.send(err);
	// res.json(profile);
	// });
}; 