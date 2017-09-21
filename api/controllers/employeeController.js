var mongoose = require('mongoose'),
	Employee = mongoose.model('Employee');
var ObjectId = require('mongoose').Types.ObjectId;

exports.createEmployee = function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var user = new Employee(req.body);
    user.save(function(err, profile){
    if(err)
        res.send(err);
    res.json(profile);
    });
}; 
exports.findAllEmployees = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	Employee.find({},function(err,profile){
			if(err) return res.send(err);
			res.json(profile);
		});
	};

exports.findEmployeeById = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	   
    query = {"employerid":req.params.Id};
    
	Employee.find(query,function(err,profile){
			if(err) return res.send(err);
			res.json(profile);
		});
	};
exports.resetEmployeePassword = function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    //var updateData = req.body;
    //var options ={upsert:true,new: true};
    var query;

    query = {"email":req.body.email};
    
    Employee.findOne(query,function(err,user){
        if (err) return res.send(err);;
        if(user)
        {    
            //user.employerid= req.body.employerid;
            // user.firstname= req.body.firstname;
            // user.lastname= req.body.lastname;
            // user.primaryphone= req.body.primaryphone;
            // user.secondaryphone= req.body.secondaryphone;
            // user.email= req.body.email;
            user.password= req.body.password;
            //user.role= req.body.role;
  
            user.save(function(error){
                if(error === null){
                    Employee.findOne(query,function(err,profile){
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
exports.updateEmployeeById = function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var updateData = req.body;
    var options ={upsert:true,new: true};
    var query;

    query = {"employeeid":req.params.Id};
    
    Employee.findOne(query,function(err,user){
        if (err) return res.send(err);;
        if(user)
        {    
            user.employerid= req.body.employerid;
            user.employeeid= req.body.employeeid;
            user.firstname= req.body.firstname;
            user.lastname= req.body.lastname;
            user.primaryphone= req.body.primaryphone;
            user.secondaryphone= req.body.secondaryphone;
            user.email= req.body.email;
            if(req.body.password!=="**********") user.password= req.body.password;
            user.role= req.body.role;
  
            user.save(function(error){
    		if(error === null){
			    Employee.findOne(query,function(err,profile){
			        if (err) return res.send(err);;
			        if(profile)
			        {
			            res.json(profile);
			        }
			    });
    		}
            if(error){

                res.json(error);
            }
        	});

        }
    });

};
exports.deleteEmployeeById = function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    query = {"employeeid":req.params.Id};

    Employee.findOneAndRemove(query,function(err,profile){
    if(err) return res.send(err);
    if(profile)
        {
            res.json(profile);
        }
    });
};
