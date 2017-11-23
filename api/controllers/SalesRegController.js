var mongoose = require('mongoose'),
	SalesReg = require('../models/SalesRegistration');

exports.createSalesQuery = function(req,res){
    var name=req.body.name;
    var contactnumber=req.body.contactnumber;
    var company=req.body.company;   
    var email = req.body.email;

    if(!name){
        return res.status(422).send({error: 'You must enter Name'});
    }
    if(!contactnumber){
        return res.status(422).send({error: 'You must enter Contact Number'});
    }
    if(!email){
        return res.status(422).send({error: 'You must enter an Email Address'});
    } 
    query = {$or:[{"email": email},{"contactnumber":contactnumber}]};
   // User.findOne({email: email,employeeid:employeeid}, function(err, existingUser){
        SalesReg.find(query, function(err,existingUser){
        if(existingUser.length>0){
            return res.status(422).send({error: 'Existing User : You are already registered with us, Thank you we will get back right at you shortly'});
        }
        if(err){            
            return next(err);            
        }        
        var salesReg = new SalesReg({
            name: name,
            email: email,
            contactnumber: contactnumber,
            company:company
        });
 
        salesReg.save(function(err, user){ 
            if(err){
                return next(err);
            }
            else{
                return res.json(user);
            }
        });
 
    }); 
}
// exports.putLegal = function(req,res){
//     // res.header("Access-Control-Allow-Origin", "*");
//     // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     // Legal.find({},function(err,legalterms){
//     //         if(err) return res.send(err);
//     //         res.json(legalterms);
//     //     });
//     };
exports.getSalesQuery = function(req,res){
    SalesReg.find({},function(err,legalterms){
            if(err) return res.send(err);
            res.json(legalterms);
        });
    };
