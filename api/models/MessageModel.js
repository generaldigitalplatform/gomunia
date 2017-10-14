var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var MessageSchema = new Schema({
	chatId:Object,
	sender:{
		email_id:String,
		registration_id:String
	},
	receiver:{
		email_id:String,
		registration_id:String
	},
	message:String
	//time_created:Date	
},{timestamps:true},{"strict":false});

module.exports = mongoose.model("Message",MessageSchema);

