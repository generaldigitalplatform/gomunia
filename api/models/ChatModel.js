var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ChatSchema = new Schema({	
	message : {
    	lastmessage:String,
    	createdAt:Date
    },
	createdBy:{
		email : String,
        firstname:String,
        lastname:String,
        primaryphone:Number,
        employeeid:String,
        employerid:String,
        registration_id:String
	},
	member: {
          email : String,
          firstname:String,
    	  lastname:String,
    	  primaryphone:Number,
    	  employerid:String,
    	  employeeid:String,
    	  registration_id:String
       },
    isClosed:Boolean
},{timestamps:true},{"strict":false})
module.exports = mongoose.model('Chat',ChatSchema);
