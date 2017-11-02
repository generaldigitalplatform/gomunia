var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ChatSchema = new Schema({	
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
       }
},{timestamps:true},{"strict":false})

module.exports = mongoose.model("Chat",ChatSchema);
