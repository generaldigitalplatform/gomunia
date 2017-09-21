//var AuthenticationController = require('../controllers/EmployerAuthenticationController'), 
   var AuthenticationController = require('../controllers/authentication'); 

    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');
    productOwnerController = require('../controllers/productOwnerController');
    employerController = require('../controllers/employerController');


// var requireAuth = passport.authenticate('jwt-employer', {session: false});
// var requireLogin = passport.authenticate('local-employer', {session: false});
 var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});
 

module.exports = function(app){
 
    var router = express.Router(),
        authRoutes = express.Router();
        empRoutes = express.Router();
    // Auth Routes
    router.use('/auth', authRoutes);

    authRoutes.post('/productowner/register', AuthenticationController.productownerregister);
    authRoutes.post('/productowner/login', requireLogin,AuthenticationController.roleAuthorization(['ProductOwner']), AuthenticationController.productownerlogin);
    authRoutes.put('/productowner/reset', productOwnerController.resetProductOwnerPassword);
 
    authRoutes.get('/protected', function(req, res){
        res.send({ content: 'Success'});
    });

    router.use('/employer', empRoutes);
    empRoutes.get('/',requireLogin,AuthenticationController.roleAuthorization(['ProductOwner']),productOwnerController.findAllProductOwners);


    app.use('/api', router);

}

