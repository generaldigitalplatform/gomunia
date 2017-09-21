var jwt = require('jsonwebtoken');  
var Employee = require('../models/Employee');
var authConfig = require('../config/auth');
 
function generateToken(user){
    return jwt.sign(user, authConfig.secret, {
        expiresIn: '365d'
    });
}
 
function setUserInfo(request){
    return {
        _id: request._id,
        employerid:request.employerid,
        employeeid:request.employeeid,
        firstname:request.firstname,
        lastname:request.lastname,
        primaryphone:request.primaryphone,
        secondaryphone:request.secondaryphone,
        email: request.email,
        role: request.role
    };
}
 
exports.employeelogin = function(req, res, next){
 
    var userInfo = setUserInfo(req.user);
 
    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });
 
}
 
exports.employeeregister = function(req, res, next){
 
    var employerid=req.body.employerid;
    var employeeid=req.body.employeeid;
    var firstname=req.body.firstname;
    var lastname=req.body.lastname;
    var primaryphone=req.body.primaryphone;
    var secondaryphone=req.body.secondaryphone;     
    var email = req.body.email;
    var password = req.body.password;
    var role = req.body.role;
 
    if(!employeeid){
        return res.status(422).send({error: 'You must enter EmployeeID'});
    }

    if(!firstname){
        return res.status(422).send({error: 'You must enter Name'});
    }
    if(!primaryphone){
        return res.status(422).send({error: 'You must enter Primary Phone Number'});
    }
    if(!email){
        return res.status(422).send({error: 'You must enter an Email Address'});
    } 
    if(!password){
        return res.status(422).send({error: 'You must enter a Password'});
    }
 
    //  var query =[   
    //     {$match:{
    //         $and:[
    //     ]}}];

    // if(email){
    //     query[0].$match.$and.push({email:email});
    // }
    // if(employeeid){
    //     query[0].$match.$and.push({employeeid:employeeid});
    // }
   
    // User.aggregate(query, function(err,profile){
    //     if (err) return res.send(err);
    //     if(profile)
    //     {           
    //         res.json(profile);
    //     }
    // });
    query = {$or:[{"email": email},{"employeeid":employeeid}]};

   // User.findOne({email: email,employeeid:employeeid}, function(err, existingUser){
        Employee.find(query, function(err,existingUser){
        if(existingUser.length>0){
            return res.status(422).send({error: 'Existing User : EmployeeID/EmailID is already in use'});
        }
        if(err){            
            return next(err);            
        }        
        var user = new Employee({
            employerid: employerid,
            employeeid: employeeid,
            firstname: firstname,
            lastname: lastname,
            primaryphone: primaryphone,
            secondaryphone: secondaryphone,
            email: email,
            password: password,
            role: role
        });
 
        user.save(function(err, user){
 
            if(err){
                return next(err);
            }
 
            var userInfo = setUserInfo(user);
 
            res.status(201).json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            })
 
        });
 
    });
 
}
 
exports.roleAuthorization = function(roles){
 
    return function(req, res, next){
 
        var user = req.user;
 
        Employee.findById(user._id, function(err, foundUser){
 
            if(err){
                res.status(422).json({error: 'No user found.'});
                return next(err);
            }
 
            if(roles.indexOf(foundUser.role) > -1){
                return next();
            }
 
            res.status(401).json({error: 'You are not authorized to view this content'});
            return next('Unauthorized');
 
        });
 
    }
 
}