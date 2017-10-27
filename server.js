var express 	= require('express'),
	app 		= express(),	
	mongoose 	= require('mongoose'),
	bodyParser  = require('body-parser'),
	cors 		= require("cors"),	
	db 			= require('./api/config/database'),
	path 		= require('path'),
	logger 		= require('./utils/logger'),
	path 		= require('path');

var	port 		= process.env.PORT;
var	ip 	 		= process.env.IP;

app.options('*', cors()); 

var connectionOptions = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } }; 

mongoose.connect(db.databaseUri,{useMongoClient:true});//,socketTimeoutMS:360000, connectTimeoutMS : 30000,keepAlive: true, reconnectTries: 30});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'logs')));

var employerRoute = require('./api/routes/employerRoute');
var employeeRoute = require('./api/routes/employeeRoute');
var productOwnerRoute = require('./api/routes/productOwnerRoute');
var jobRoute = require('./api/routes/jobRoute');
var pushMessageRoute = require('./api/routes/PushMessageRoute');
var googleMapsRoute = require('./api/routes/googleMaps');
var chatRoute = require('./api/routes/chatRoute');
var chatGroupRoute = require('./api/routes/chatGroupRoute');

var port = 3000;
var httpServer = require('http').createServer(app);
//httpServer.listen(port,ip, function() {
httpServer.listen(port, function() {
    logger.info('gomunia-server started and running on port ' + port + ' and ip ' + ip);
});

productOwnerRoute(app);
employerRoute(app);
employeeRoute(app);
jobRoute(app);
pushMessageRoute(app);
googleMapsRoute(app);
chatRoute(app);
chatGroupRoute(app);

module.exports = app;