var mongoose = require('mongoose'),
	FieldForceModel = mongoose.model('FieldForce');
var ObjectId = require('mongoose').Types.ObjectId;

exports.findAllFieldForce = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	FieldForceModel.find({},function(err,profile){
			if(err)
				res.send(err);
			res.json(profile);
		});
	};
exports.createTelesalesReportsById = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var FieldForceObjId = new ObjectId((req.params.Id.length < 12) ? "123456789012" : req.params.Id);
	//var query = {$or:[{"_id":FieldForceObjId},{"FieldForceId":req.params.Id},{"PrimaryPhone":req.params.Id},{"SecondaryPhone":req.params.Id},{"WorkInfo.WorkArea.Pincode":[]}]};
   
	var query = {"WorkInfo.WorkLocation.Pincode":{"$in":["1"]}};
	//PersonModel.find({ favouriteFoods: { "$in" : ["sushi"]} }, ...);

	//var query = {"WorkInfo.Pincode":{"$in":["643001"]}};
	FieldForceModel.find(query,function(err,profile){
		if (err) res.send(err);
		if(profile)
		{
			res.json(profile);
		}
	});

};
exports.findFieldForceById = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var FieldForceObjId = new ObjectId((req.params.Id.length < 12) ? "123456789012" : req.params.Id);
	var query = {$or:[{"_id":FieldForceObjId},{"WorkInfo.FieldForceId":req.params.Id},{"WorkInfo.WorkLocation.Name":req.params.Id},{"PrimaryPhone":req.params.Id},
	{"SecondaryPhone":req.params.Id},{"WorkInfo.WorkLocation.Area":{"$in":[req.params.Id]}},
	{"WorkInfo.WorkLocation.Pincode":{"$in":[req.params.Id]}}]}

	//var query = {"WorkInfo.Pincode":{"$in":["643001"]}};
	FieldForceModel.find(query,function(err,profile){
		if (err) res.send(err);
		if(profile)
		{
			res.json(profile);
		}
	});

};
exports.createNewFieldForce = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var newFieldForceProfile = new FieldForceModel(req.body);
	newFieldForceProfile.save(function(err, profile){
	if(err)
		res.send(err);
	res.json(profile);
	});
}; 
exports.updateFieldForceById = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var query = {"PrimaryPhone":req.params.Id};
	var updateData = req.body;
	var options = {upsert:true,new: true};
	
	var FieldForceObjId = new ObjectId((req.params.Id.length < 12) ? "123456789012" : req.params.Id);
	var query = {$or:[{"_id":FieldForceObjId},{"FieldForceId":req.params.Id},{"PrimaryPhone":req.params.Id},{"SecondaryPhone":req.params.Id},{'ContactAddress.Pincode':req.params.Id},{'ContactAddress.City':req.params.Id},{'ContactAddress.Zone':req.params.Id},{'ContactAddress.State':req.params.Id},{'ContactAddress.Area':req.params.Id}]};	

	FieldForceModel.findOneAndUpdate(query,{$set:updateData},options,function(err,profile){
		if (err) res.send(err);;
		if(profile)
		{
			res.json(profile);
		}
	});
};
exports.deleteAllFieldForce = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	FieldForceModel.remove({},function(err,profile){
			if(err)
				res.send(err);
			res.json(profile);
		});
	};
exports.deleteFieldForceById = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var FieldForceObjId = new ObjectId((req.params.Id.length < 12) ? "123456789012" : req.params.Id);
	var query = {$or:[{"_id":FieldForceObjId},{"FieldForceId":req.params.Id},{"PrimaryPhone":req.params.Id},{"SecondaryPhone":req.params.Id},{'ContactAddress.Pincode':req.params.Id},{'ContactAddress.City':req.params.Id},{'ContactAddress.Zone':req.params.Id},{'ContactAddress.State':req.params.Id},{'ContactAddress.Area':req.params.Id}]};	

	FieldForceModel.findOneAndRemove(query,function(err,profile){
		if(err)
			res.send(err);
		res.json(profile);
	});
};