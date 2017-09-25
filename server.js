var express 	= require('express'),
	app 		= express(),	
	mongoose 	= require('mongoose'),
	bodyParser  = require('body-parser'),
	cors = require("cors"),
	db = require('./api/config/database');

app.options('*', cors()); 

var connectionOptions = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } }; 

mongoose.connect(db.databaseUri,{useMongoClient:true});//,socketTimeoutMS:360000, connectTimeoutMS : 30000,keepAlive: true, reconnectTries: 30});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var employerRoute = require('./api/routes/employerRoute');
var employeeRoute = require('./api/routes/employeeRoute');
var productOwnerRoute = require('./api/routes/productOwnerRoute');
var jobRoute = require('./api/routes/jobRoute');
var pushMessageRoute = require('./api/routes/PushMessageRoute');
var googleMapsRoute = require('./api/routes/googleMaps');

var port = 3000;
var httpServer = require('http').createServer(app);
httpServer.listen(process.env.PORT,process.env.IP, function() {
//httpServer.listen(port, function() {
    console.log('gomunia-server running on port ' + port + '.');
});

productOwnerRoute(app);
employerRoute(app);
employeeRoute(app);
jobRoute(app);
pushMessageRoute(app);
googleMapsRoute(app);

module.exports = app;