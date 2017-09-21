var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var DeviceTokenSchema = new Schema({
	DeviceToken:String,
	FCMRegistrationToken:String,
	UserId:String
},{timestamps:true},{"strict":false});

module.exports = mongoose.model("DeviceToken",DeviceTokenSchema);
