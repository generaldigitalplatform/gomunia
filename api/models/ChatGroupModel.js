var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ChatGroupSchema = new Schema({
	createdBy:{
		email : String,
        firstname:String,
        lastname:String,
        primaryphone:Number,
        employeeid:String,
        employerid:String
	},
	members: [{
          email : String,
          firstname:String,
    	  lastname:String,
    	  primaryphone:Number,
    	  employerid:String,
    	  employeeid:String,
    	  registration_id:String
    }],
	chatGroupName:String,
	chatGroupKey:String,
},{timestamps:true},{"strict":false})

module.exports = mongoose.model("ChatGroup",ChatGroupSchema);
