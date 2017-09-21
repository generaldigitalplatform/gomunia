var mongoose = require('mongoose'),
	ProductOwner = mongoose.model('ProductOwner');
    Employer = mongoose.model('Employer');

var ObjectId = require('mongoose').Types.ObjectId;

exports.findAllProductOwners = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	ProductOwner.find({},function(err,profile){
			if(err) return res.send(err);
			res.json(profile);
		});
	};
exports.findAllEmployers = function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    Employer.find({},function(err,profile){
            if(err) return res.send(err);
            res.json(profile);
        });
    };
exports.findEmployerById = function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
       
    query = {"productownerid":req.params.Id};
    
    Employer.find(query,function(err,profile){
            if(err) return res.send(err);
            res.json(profile);
        });
    };

exports.resetProductOwnerPassword = function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var query;

    query = {"email":req.body.email};
    
    ProductOwner.findOne(query,function(err,user){
        if (err) return res.send(err);;
        if(user)
        {
            user.password= req.body.password;
            user.save(function(error){
        		if(error === null){
				    Employer.findOne(query,function(err,profile){
				        if (err) return res.send(err);;
				        if(profile)
				        {
				            res.json(profile);
				        }
				    });
        		}
        	});
        }
    });

};
exports.deleteProductOwnerById = function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    query = {"productownerid":req.params.Id};

    ProductOwner.findOneAndRemove(query,function(err,profile){
    if(err) return res.send(err);
    if(profile)
        {
            res.json(profile);
        }
    });
};
