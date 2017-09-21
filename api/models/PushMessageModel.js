var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//fcm model
var FCMSchema = new Schema({
	DeviceToken:String,
	FCMregistrationToken:String,
	UserId:String
},{timestamps:true},{"strict":false});

module.exports = mongoose.model("FCM",FCMSchema);
