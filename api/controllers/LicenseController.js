var mongoose = require('mongoose'),
	LicenseModel = require('../models/License');
var ObjectId = require('mongoose').Types.ObjectId;
var LicenseKeyObj = require('licensekey');

function getRandomInt( min, max ) {
         return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
    }
    
function generateProductKey() {
    var tokens = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        chars = 5,
        segments = 4,
        keyString = "";
        
    for( var i = 0; i < segments; i++ ) {
        var segment = "";
        
        for( var j = 0; j < chars; j++ ) {
            var k = getRandomInt( 0, 35 );
            segment += tokens[ k ];
        }
        
        keyString += segment;
        
        if( i < ( segments - 1 ) ) {
            keyString += "-";
        }
    }    
    return keyString;

}
exports.createLicense = function(req,res){
   
    var licenseKeys = [];
    let userInfo =  req.body.userInfo;
    // {
    // name: req.body.userInfo.name,
    // company: req.body.userInfo.company,
    // email: req.body.userInfo.email,
    // primaryPhone: req.body.userInfo.primaryPhone,
    // secondaryPhone: req.body.userInfo.secondaryPhone,
    //     address : {    
    //         number:req.body.userInfo.address.number,
    //         street:req.body.userInfo.address.street,
    //         city:req.body.userInfo.address.city,
    //         state:req.body.userInfo.address.state,
    //         country:req.body.userInfo.address.country,
    //         pincode:req.body.userInfo.address.pincode    
    //     }
    // }
   let licenseInfo = req.body.licenseInfo;
   // {
   //      prodCode: req.body.licenseInfo.prodCode,
   //      appVersion: req.body.licenseInfo.appVersion,
   //      osType: req.body.licenseInfo.osType
   //  }
    var userLicense = {info:userInfo, prodCode:req.body.licenseInfo.prodCode, appVersion:req.body.licenseInfo.appVersion, osType:req.body.licenseInfo.osType}
 //   try{

        for(var i=0; i<req.body.totalLicense; i++){
          //  var licenseObj = generateProductKey(); //LicenseKeyObj.createLicense(userLicense)
            var keyObj = {
                key : generateProductKey(),
                status : 'notUsed'
            }
            licenseKeys.push(keyObj);   
        }
        var licenseKey = new LicenseModel({userInfo,licenseInfo,licenseKeys});
        licenseKey.save(function(err, profile){
        if(err) res.status(500).send({"error":err}).end();
        else{
            res.status(200).json({"license":profile});
        }
    });        
    // }
    // catch{

    // }
}
function search(nameKey, licenseKeys){
    for (var i=0; i < licenseKeys.length; i++) {
        if (licenseKeys[i].key === nameKey) {
            return {'index':i, 'licenseKeys': licenseKeys[i]};
        }
    }
}
exports.validateLicense = function(req,res){
    var key = req.body.key;
    var query = {licenseKeys: {$elemMatch: {key:key}}};
    
    LicenseModel.find(query,function(err,profile){
        if(err) return res.send(err).end();
        if(profile.length === 0) {
            return res.send({"license":"License Key is not valid"}).end();
        }
        if(profile.length > 0) {
            var keyOne = search(key, profile[0].licenseKeys);
            if(profile[0].licenseKeys[keyOne.index].status === 'beingUsed'){
                return res.send({"license":"License Key is being used already"}).end();
            }
            else{
                profile[0].licenseKeys[keyOne.index].status = 'beingUsed';
                profile[0].save(function(error, profile){
                if(error === null){
                    return res.send({"license":keyOne}).end();
                    }
                });       
            }             
        }
    });
}
exports.releaseLicense = function(req,res){
    var key = req.body.key;
    var query = {licenseKeys: {$elemMatch: {key:key}}};
    
    LicenseModel.find(query,function(err,profile){
        if(err) return res.send(err).end();
        if(profile.length === 0) {
            return res.send({"license":"License Key is not valid"}).end();
        }
        if(profile.length > 0) {
            var keyOne = search(key, profile[0].licenseKeys);
            if(profile[0].licenseKeys[keyOne.index].status === 'beingUsed'){
                profile[0].licenseKeys[keyOne.index].status = 'notUsed'
                profile[0].save(function(error, profile){
                if(error === null){
                    return res.send({"license":"License Key is available"}).end();
                    }
                }); 
            }else{
                return res.send({"license":"License Key is available"}).end();
            }            
        }
    });
}
exports.findAllUsers = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	LicenseModel.find({},function(err,profile){
			if(err) return res.send(err);
			res.json(profile);
		});
	};

exports.findUserById = function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	   
    query = {"employerid":req.params.Id};
    
	LicenseModel.find(query,function(err,profile){
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
    
    LicenseModel.findOne(query,function(err,user){
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

    LicenseModel.findOneAndRemove(query,function(err,profile){
    if(err) return res.send(err);
    if(profile)
        {
            res.json(profile);
        }
    });
};
