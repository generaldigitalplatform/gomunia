var jwt = require('jsonwebtoken');  
var Employer = require('../models/Employer');
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
        name:request.name,
        address:request.address,
        primaryphone:request.primaryphone,
        secondaryphone:request.secondaryphone,
        email: request.email,
        role: request.role
    };
}
 
exports.employerlogin = function(req, res, next){
 
    var userInfo = setUserInfo(req.user);
 
    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });
 
}
 
exports.employerregister = function(req, res, next){
 
    var employerid=req.body.employerid;
    var name=req.body.name;
    var address=req.body.address;
    var primaryphone=req.body.primaryphone;
    var secondaryphone=req.body.secondaryphone;     
    var email = req.body.email;
    var password = req.body.password;
    var role = req.body.role;
 
    if(!employerid){
        return res.status(422).send({error: 'You must enter EmployeeID'});
    }
    if(!name){
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

    query = {$or:[{"email": email}]};

        Employer.find(query, function(err,existingUser){
        if(existingUser.length>0){
            return res.status(422).send({error: 'Existing User : EmployeeID/EmailID is already in use'});
        }
        if(err){            
            return next(err);            
        }        
        var employer = new Employer({
            employerid: employerid,
            name: name,
            address: address,
            primaryphone: primaryphone,
            secondaryphone: secondaryphone,
            email: email,
            password: password,
            role: role
        });
 
        employer.save(function(err, user){
 
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
 
        Employer.findById(user._id, function(err, foundUser){
 
            if(err){
                res.status(422).json({error: 'No employer found.'});
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