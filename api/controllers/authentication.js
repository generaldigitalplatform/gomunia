var jwt = require('jsonwebtoken');  
var User = require('../models/User');
var authConfig = require('../config/auth');
var Employer = require('../models/Employer');
var Employee = require('../models/Employee');
var ProductOwner = require('../models/ProductOwner');


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
function setEmployeeInfo(request){
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

function setEmployerInfo(request){
    return {
        _id: request._id,
        productownerid:request.productownerid,
        employerid:request.employerid,
        name:request.name,
        address:request.address,
        primaryphone:request.primaryphone,
        secondaryphone:request.secondaryphone,
        email: request.email,
        role: request.role
    };
}

function setProductOwnerInfo(request){
    return {
        _id: request._id,
        productownerid:request.productownerid,
        name:request.name,
        address:request.address,
        primaryphone:request.primaryphone,
        secondaryphone:request.secondaryphone,
        email: request.email,
        role: request.role
    };
}
 
exports.login = function(req, res, next){
 
    var userInfo = setUserInfo(req.user);
 
    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    }); 
}
 
exports.register = function(req, res, next){
 
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
    query = {$or:[{"email": email},{"employeeid":employeeid}]};
   // User.findOne({email: email,employeeid:employeeid}, function(err, existingUser){
        User.find(query, function(err,existingUser){
        if(existingUser.length>0){
            return res.status(422).send({error: 'Existing User : EmployeeID/EmailID is already in use'});
        }
        if(err){            
            return next(err);            
        }        
        var user = new User({
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
exports.employeelogin = function(req, res, next){
 
    var userInfo = setEmployeeInfo(req.user);
 
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
exports.employerlogin = function(req, res, next){
 
    var userInfo = setEmployerInfo(req.user);
 
    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    }); 
}
 
exports.employerregister = function(req, res, next){
 
    var productownerid = req.body.productownerid;
    var employerid=req.body.employerid;
    var name=req.body.name;
    var address=req.body.address;
    var primaryphone=req.body.primaryphone;
    var secondaryphone=req.body.secondaryphone;     
    var email = req.body.email;
    var password = req.body.password;
    var role = req.body.role;
 
    if(!employerid){
        return res.status(422).send({error: 'You must enter EmployerID'});
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

    query = {$or:[{"email": email},{"employerid":employerid}]};

        Employer.find(query, function(err,existingUser){
        if(existingUser.length>0){
            return res.status(422).send({error: 'Existing User : EmployerID/EmailID is already in use'});
        }
        if(err){            
            return next(err);            
        }        
        var employer = new Employer({
            productownerid:productownerid,
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
 
            var userInfo = setEmployerInfo(user);
 
            res.status(201).json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            })
 
        });
 
    }); 
}

exports.productownerlogin = function(req, res, next){
 
    var userInfo = setProductOwnerInfo(req.user);
 
    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    }); 
}
 
exports.productownerregister = function(req, res, next){
 
    var productownerid=req.body.productownerid;
    var name=req.body.name;
    var address=req.body.address;
    var primaryphone=req.body.primaryphone;
    var secondaryphone=req.body.secondaryphone;     
    var email = req.body.email;
    var password = req.body.password;
    var role = req.body.role;
 
    if(!productownerid){
        return res.status(422).send({error: 'You must enter Product Owner ID'});
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

    query = {$or:[{"email": email},{"productownerid":productownerid}]};

        ProductOwner.find(query, function(err,existingUser){
        if(existingUser.length>0){
            return res.status(422).send({error: 'Existing User : EmployeeID/EmailID is already in use'});
        }
        if(err){            
            return next(err);            
        }        
        var productowner = new ProductOwner({
            productownerid: productownerid,
            name: name,
            address: address,
            primaryphone: primaryphone,
            secondaryphone: secondaryphone,
            email: email,
            password: password,
            role: role
        });
 
        productowner.save(function(err, user){
 
            if(err){
                return next(err);
            }
 
            var userInfo = setEmployerInfo(user);
 
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
 
        // User.findById(user._id, function(err, foundUser){
        Employee.findById(user._id, function(err, foundUser){  
            if(err){
                res.status(422).json({error: 'No user found.'});
                return next(err);
            }
            if( foundUser){
                if(roles.indexOf(foundUser.role) > -1){
                    return next();
                } 
            }

                Employer.findById(user._id, function(err, foundUser){     
                    if(err){
                        res.status(422).json({error: 'No user found.'});
                        return next(err);
                    }
                    if(foundUser){
                        if(roles.indexOf(foundUser.role) > -1){
                            return next();
                        }
                    }               

                    ProductOwner.findById(user._id, function(err, foundUser){         
                        if(err){
                            res.status(422).json({error: 'No user found.'});
                            return next(err);
                        }
                        if(foundUser){
                            if(roles.indexOf(foundUser.role) > -1){
                                return next();
                            }
                        }                 
                        res.status(401).json({error: 'You are not authorized to view this content'});
                        return next('Unauthorized');

                    });
                });
            });
    
        } 
}