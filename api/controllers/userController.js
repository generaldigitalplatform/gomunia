var mongoose = require('mongoose'),
	User = mongoose.model('User');
var ObjectId = require('mongoose').Types.ObjectId;

exports.findAllUsers = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	User.find({},function(err,profile){
			if(err) return res.send(err);
			res.json(profile);
		});
	};

exports.findUserById = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	   
    query = {"employerid":req.params.Id};
    
	User.find(query,function(err,profile){
			if(err) return res.send(err);
			res.json(profile);
		});
	};


exports.updateUserById = function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var updateData = req.body;
    var options ={upsert:true,new: true};
    var query;

    query = {"employeeid":req.params.Id};
    
    User.findOne(query,function(err,user){
        if (err) return res.send(err);;
        if(user)
        {    
            user.employeeid= req.body.employeeid;
            user.firstname= req.body.firstname;
            user.lastname= req.body.lastname;
            user.primaryphone= req.body.primaryphone;
            user.secondaryphone= req.body.secondaryphone;
            user.email= req.body.email;
            user.password= req.body.password;
            user.role= req.body.role;
  
            user.save(function(error){
        		if(error === null){
				    User.findOne(query,function(err,profile){
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
exports.deleteUserById = function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    query = {"employeeid":req.params.Id};

    User.findOneAndRemove(query,function(err,profile){
    if(err) return res.send(err);
    if(profile)
        {
            res.json(profile);
        }
    });
};
