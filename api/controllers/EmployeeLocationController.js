var mongoose = require('mongoose'),
	employeeLocationModel = mongoose.model('EmployeeLocation');
var ObjectId = require('mongoose').Types.ObjectId;

exports.findAllEmployeeLocation = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	employeeLocationModel.find({},function(err,profile){
			if(err)
				res.send(err);
			res.json(profile);
		});
	};
exports.findEmployeeLocationById = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	var employeeLocationObjId = new ObjectId((req.params.Id.length < 12) ? "123456789012" : req.params.Id);
	var query = {$or:[{"_id":employeeLocationObjId},{"EmployeeId":req.params.Id}]};	

	employeeLocationModel.findOne(query,function(err,profile){
		if (err) res.send(err);;
		if(profile)
		{
			res.json(profile);
		}
	});
// 	employeeLocationModel.findOne(query,function(err,location){
// 	if (err) res.send(err);
// 	if(location)
// 	{
// 		var maxDistance = 1000 / 6371;
// 		var limit =  100;
// 		var coordinates = [];
// 	    coordinates[0] = location.CurrentLocation.Coordinates[0];//req.query.longitude;
// 	    coordinates[1] = location.CurrentLocation.Coordinates[1];//req.query.latitude; 	
// 		 employeeLocationModel.find({
// 	      CurrentLocation: {
// 	        $near: {"type":"Points","Coordinates":coordinates},
// 	        $maxDistance: maxDistance
// 	      }
// 	    }).limit(limit).exec(function(err, locations){
// 	      if (err) {
// 	        return res.json(500, err);
// 	      }
// 	      res.json(200, locations);
// 		 });
// 	}
// });
				
};
exports.createEmployeeLocation = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var newEmployeeLocation = new employeeLocationModel(req.body);
	newEmployeeLocation.save(function(err, profile){
	if(err)
		res.send(err);
	res.json(profile);
	});
}; 
exports.updateEmployeeLocationById = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var updateData = req.body;

	var options = {upsert:true,new: true};
	
	var employeeLocationObjId = new ObjectId( (req.params.Id.length < 12) ? "123456789012" : req.params.Id );
	var query = {$or:[{"_id":employeeLocationObjId},{"EmployeeId":req.params.Id}]};
	
	employeeLocationModel.findOneAndUpdate(query,{$set:updateData},options,function(err,feedback){
		if (err) res.send(err);;
		if(feedback)
		{
			res.json(feedback);
		}
	});

	
};
exports.deleteAllEmployeeLocations = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	employeeLocationModel.remove({},function(err,profile){
			if(err)
				res.send(err);
			res.json(profile);
		});
	};
exports.deleteEmployeeLocationById = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	
	var customerLocationObjId = new ObjectId((req.params.Id.length < 12) ? "123456789012" : req.params.Id);
	var query = {$or:[{"_id":customerLocationObjId},{"PrimaryPhone":req.params.Id},{"SecondaryPhone":req.params.Id},{'ContactAddress.Pincode':req.params.Id},{'ContactAddress.City':req.params.Id},{'ContactAddress.Zone':req.params.Id},{'ContactAddress.State':req.params.Id},{'ContactAddress.Area':req.params.Id}]};	


	//(req.params.Id.length < 12) ? "123456789012" : req.params.Id
	employeeLocationModel.findOneAndRemove(query,function(err,profile){
		if(err)
			res.send(err);
		res.json(profile);
	});
};