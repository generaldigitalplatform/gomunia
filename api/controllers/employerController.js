var mongoose = require('mongoose'),
	Employer = mongoose.model('Employer');
var ObjectId = require('mongoose').Types.ObjectId;


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
exports.resetEmployerPassword = function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    //var updateData = req.body;
    //var options ={upsert:true,new: true};
    var query;

    query = {"email":req.body.email};
    
    Employer.findOne(query,function(err,user){
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
        else{
            return res.status(422).send({error: 'User Not Found'});
        }
    });

};
exports.forgetEmployerPassword = function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      Employer.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
          user: '!!! YOUR SENDGRID USERNAME !!!',
          pass: '!!! YOUR SENDGRID PASSWORD !!!'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
};
exports.updateEmployerById = function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var updateData = req.body;
    var options ={upsert:true,new: true};
    var query;

    query = {"employerid":req.params.Id};
    
    Employer.findOne(query,function(err,user){
        if (err) return res.send(err);;
        if(user)
        {    
            user.employeeid= req.body.employerid;
            user.name= req.body.name;
            user.address= req.body.address;
            user.primaryphone= req.body.primaryphone;
            user.secondaryphone= req.body.secondaryphone;
            user.email= req.body.email;
            user.password= req.body.password;
            user.role= req.body.role;
  
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
exports.deleteEmployerById = function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    query = {"employerid":req.params.Id};

    Employer.findOneAndRemove(query,function(err,profile){
    if(err) return res.send(err);
    if(profile)
        {
            res.json(profile);
        }
    });
};
