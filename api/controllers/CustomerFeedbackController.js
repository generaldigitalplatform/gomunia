var mongoose = require('mongoose'),
	customerFeedbackModel = mongoose.model('CustomerFeedback'),
	customerProfileModel = mongoose.model('CustomerProfile');
var ObjectId = require('mongoose').Types.ObjectId;

exports.createNewCustomerFeedback = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	var customerFeedback = new customerFeedbackModel(req.body);	
	customerFeedback.save(function(err, feedback){
	if(err)
		res.send(err);
	res.json(feedback);
	});
}
exports.findAllCustomerFeedback = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	customerFeedbackModel.find({},function(err,feedback){
			if(err)	res.send(err);
			if(feedback)
			{
				res.json(feedback);
			}
		});
	};
exports.findProductFeedbackDetailsCountById = function(req,res){
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

customerFeedbackModel.find({},function(err,feedback){
			if(err)	res.send(err);
			if(feedback)
			{
				//res.json(feedback);
			}
		});

	customerFeedbackModel.count(({"CollectedBy":req.body.collectedby,"createdAt":{$gte:gteQuery,$lte:lteQuery}}),function(err,count){
	if (err) return res.send(err);
	if(count){
			totalFeedback=count
		}

		customerFeedbackModel.count(({ $where: "this.Industry[0].Company[0].Product[0].ProductFeedback[0].length >= 1"}),function(err,count){
		if (err) return res.send(err);
		if(count){
			ProductInterested=count
		}
		});
		// if(customerFeedbackModel.Industry[0].Company[0].Product[0].ProductFeedback[0].ProductsInterestedDetails.length>1){
		// customerFeedbackModel.count(({"Industry.Company.Product.ProductFeedback.ProductsInterestedDetails":req.body.employeeid,"createdAt":{$gte:gteQuery,$lte:lteQuery}}),function(err,count){
		// 		if (err) return res.send(err);
		// 		if(count){
		// 			res.send({
		// 			"ProductInterested" :count
		// 			});
		// 		}
		// 	});
		// };
		// if(customerFeedbackModel.Industry.Company.Product.ProductFeedback.ProductsNotInterestedDetails.length>1){
		// customerFeedbackModel.count(({"Industry.Company.Product.ProductFeedback.ProductsNotInterestedDetails":req.body.employeeid,"JobStatus":"Rescheduled","createdAt":{$gte:gteQuery,$lte:lteQuery}}),function(err,count){
		// 		if (err) return res.send(err);
		// 		if(count){
		// 			res.send({
		// 			"ProductNotInterested":count
		// 			});
		// 		}
		// 	});
		// };					

	});
};
exports.findCustomerFeedbackById = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var totalFeedback;
	var customerFeedbackObjId = new ObjectId((req.params.Id.length < 12) ? "123456789012" : req.params.Id);
	var query = {$or:[{"CustomerId":customerFeedbackObjId},{"_id":customerFeedbackObjId},{"PrimaryPhone":req.params.Id},{"SecondaryPhone":req.params.Id},{'ContactAddress.Pincode':req.params.Id},{'ContactAddress.City':req.params.Id},{'ContactAddress.Zone':req.params.Id},{'ContactAddress.State':req.params.Id},{'ContactAddress.Area':req.params.Id}]};
	var query = {$or:[{"CustomerId":customerFeedbackObjId},{"_id":customerFeedbackObjId},{"PrimaryPhone":req.params.Id},{"SecondaryPhone":req.params.Id},{'ContactAddress.Pincode':req.params.Id},{'ContactAddress.City':req.params.Id},{'ContactAddress.Zone':req.params.Id},{'ContactAddress.State':req.params.Id},{'ContactAddress.Area':req.params.Id}]};

	customerFeedbackModel.findOne(query,function(err,feedback){
		if (err) res.send(err);
		if(feedback)
		{
			res.json(feedback);
		}
	});
};
exports.findCustomerFeedbackDetailsByEmployeeId = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	var customerFeedbackObjId = new ObjectId((req.params.Id.length < 12) ? "123456789012" : req.params.Id);
	var query = {$or:[{"CustomerId":customerFeedbackObjId},{"_id":customerFeedbackObjId},{"CollectedBy":req.params.Id}]};
	
	customerFeedbackModel.count(query,function(err,feedback){
		if (err) res.send(err);
		if(feedback)
		{
			res.json(feedback);
		}
	}).maxTime(1).exec();
};
exports.updateCustomerFeedbackById = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	var updateData = req.body;
	var options = {upsert:true,new: false};
	
	var customerFeedbackObjId = new ObjectId((req.params.Id.length < 12) ? "123456789012" : req.params.Id);
	var query = {$or:[{"_id":req.params.Id},{"PrimaryPhone":req.params.Id},{"SecondaryPhone":req.params.Id},{'ContactAddress.Pincode':req.params.Id},{'ContactAddress.City':req.params.Id},{'ContactAddress.Zone':req.params.Id},{'ContactAddress.State':req.params.Id},{'ContactAddress.Area':req.params.Id}]};
	
	customerFeedbackModel.findOneAndUpdate(query,{$set:updateData},options,function(err,feedback){
		if (err) res.send(err);;
		if(feedback)
		{
			res.json(feedback);
		}
	});
};
exports.deleteAllCustomerFeedback = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	customerFeedbackModel.remove({},function(err,feedback){
			if(err) res.send(err);
			if(feedback)
			{
				res.json(feedback);
			}
		});
	};
exports.deleteCustomerFeedbackById = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var updateData = req.body;
	var options = {upsert:true,new: false};
	
	var customerFeedbackObjId = new ObjectId((req.params.Id.length < 12) ? "123456789012" : req.params.Id);
	var query = {$or:[{"_id":customerFeedbackObjId},{"PrimaryPhone":req.params.Id},{"SecondaryPhone":req.params.Id},{'ContactAddress.Pincode':req.params.Id},{'ContactAddress.City':req.params.Id},{'ContactAddress.Zone':req.params.Id},{'ContactAddress.State':req.params.Id},{'ContactAddress.Area':req.params.Id}]};	

	customerFeedbackModel.findOneAndRemove(query,function(err,feedback){
		if (err) res.send(err);;
		if(feedback)
		{
			res.json(feedback);
		}
	});
};
