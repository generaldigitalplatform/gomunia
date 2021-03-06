var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = require('mongoose').Types.ObjectId;

var MessageSchema = new Schema({
	chatId: {
	    type: Schema.Types.ObjectId,
	    required: true
    },
	author : {
        email:String,
        firstname:String,
        lastname:String,
        primaryphone:String,
        employeeid:String,
        employerid:String,
        registration_id:String
    },
    messagePayload: {
	    messageType : String,
	    message:String,
	    receiver:{
	    	email:String,
	    	firstname:String,
	    	lastname:String,
	    	primaryphone:String,
	    	employeeid:String,
        	employerid:String,
	    	registration_id:String,
	    	read:Boolean,
	    	delivered : Boolean,
	    	last_seen:Date
	    }
	},  	
 },{timestamps:true},{"strict":false});
module.exports = mongoose.model("Message",MessageSchema);



