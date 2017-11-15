var mongoose = require('mongoose'),
	Legal = require('../models/legal');

exports.createLegal = function(req,res){
    legalObj = new Legal({
        legal:req.body.legal

    });

	legalObj.save(function(err,legalterms){
			if(err) return res.send(err);
			res.json(legalterms);
		});
	};
// exports.putLegal = function(req,res){
//     // res.header("Access-Control-Allow-Origin", "*");
//     // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     // Legal.find({},function(err,legalterms){
//     //         if(err) return res.send(err);
//     //         res.json(legalterms);
//     //     });
//     };
exports.getLegal = function(req,res){
    Legal.find({},function(err,legalterms){
            if(err) return res.send(err);
            res.json(legalterms);
        });
    };
