var mongoose = require('mongoose'),
	customerProfileModel = mongoose.model('CustomerProfile');
var ObjectId = require('mongoose').Types.ObjectId;

exports.createNewCustomerProfile = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var customerProfile = new customerProfileModel(req.body);
	customerProfile.save(function(err, profile){
	if(err)
		res.send(err);
	res.json(profile);
	});
}; 
exports.findAllCustomerProfile = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	customerProfileModel.find({},function(err,profile){
			if(err)
				res.send(err);
			res.json(profile);
		});
	};
exports.findCustomerProfileById = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	var customerObjId = new ObjectId((req.params.Id.length < 12) ? "123456789012" : req.params.Id );
	var query = {$or:[{"_id":customerObjId},{"PrimaryPhone":req.params.Id},{"SecondaryPhone":req.params.Id},{'ContactAddress.Pincode':req.params.Id},{'ContactAddress.City':req.params.Id},{'ContactAddress.Zone':req.params.Id},{'ContactAddress.State':req.params.Id},{'ContactAddress.Area':req.params.Id}]};
	
	customerProfileModel.findOne(query,function(err,profile){
		if (err) res.send(err);;
		if(profile)
		{
			res.json(profile);
		}
	}).maxTime(1).exec();
};
exports.findTotalCallById = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	//var jobObjId = new ObjectId((req.params.Id.length < 12) ? "123456789012" : req.params.Id);
		
	var lteQuery;
	var gteQuery;

	gteQuery = new Date(req.body.fromDate).toISOString();
	if(req.body.fromDate == req.body.toDate){
		lteQuery = new Date(req.body.toDate).toISOString();
	}
	else{
		lteQuery = new Date(req.body.toDate).toISOString();
	}

	customerProfileModel.count(({"CreatedBy":req.body.createdby,"createdAt":{$gte:gteQuery,$lte:lteQuery}}),function(err,count){
	if (err) return res.send(err);
	if(count){		
		res.send({
				"totalCalls":count	
			});
		};
	});
};

exports.updateCustomerProfileById = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	var updateData = req.body;
	var options = {upsert:true,new: true};
	
	var customerObjId = new ObjectId((req.params.Id.length < 12) ? "123456789012" : req.params.Id );
	var query = {$or:[{"_id":customerObjId},{"PrimaryPhone":req.params.Id},{"SecondaryPhone":req.params.Id},{'ContactAddress.Pincode':req.params.Id},{'ContactAddress.City':req.params.Id},{'ContactAddress.Zone':req.params.Id},{'ContactAddress.State':req.params.Id},{'ContactAddress.Area':req.params.Id}]};
	
	customerProfileModel.findOneAndUpdate(query,{$set:updateData},options,function(err,profile){
		if (err) res.send(err);;
		if(profile)
		{
			res.json(profile);
		}
	});
};
exports.deleteAllCustomerProfile = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	customerProfileModel.remove({},function(err,profile){
			if(err)
				res.send(err);
			res.json(profile);
		});
	};
exports.deleteCustomerProfileById = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	//var query = {_id:req.params.Id};
	var customerObjId = new ObjectId((req.params.Id.length < 12) ? "123456789012" : req.params.Id );
	var query = {$or:[{"_id":customerObjId},{"PrimaryPhone":req.params.Id},{"SecondaryPhone":req.params.Id},{'ContactAddress.Pincode':req.params.Id},{'ContactAddress.City':req.params.Id},{'ContactAddress.Zone':req.params.Id},{'ContactAddress.State':req.params.Id},{'ContactAddress.Area':req.params.Id}]};
	customerProfileModel.findOneAndRemove(query,function(err,profile){
		if (err) res.send(err);;
		if(profile)
		{
			res.json(profile);
		}
	});
};
