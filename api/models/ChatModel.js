var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ChatSchema = new Schema({
	chatId:Object,
	members:[{
		emailid:String,
		registration_id:String
	}]
},{timestamps:true},{"strict":false})

module.exports = mongoose.model("Chat",ChatSchema);
