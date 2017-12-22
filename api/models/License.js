var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LicenseKeySchema = new Schema({
	userInfo:{
	name:String,
	company:String,
	email:String,
	primaryPhone:String,
	secondaryPhone:String,
	address:{
		number:String,
		street:String,
		city:String,
		state:String,
		country:String,
		pincode:String
		}	
	},	
	licenseInfo:{
		prodCode:String,
		appVersion:String,
		osType:String
	},
	licenseKeys:[{
		key:String,
		status: {
        type: String,
        enum: ['notUsed', 'beingUsed'],
        default: 'notUsed'
    	}
	}]

},{"strict":false});

module.exports = mongoose.model('LicenseKey',LicenseKeySchema);


