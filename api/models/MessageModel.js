var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var ConversationSchema = new Schema({
	conversationId:Object,
	members:[]
},{timestamps:true},{"strict":false})

var MessageSchema = new Schema({
	conversationId:Object,
	sender:String,
	receiver:String,
	Message:{
		type:Number,
		text:String,
		image:{
			data:Buffer,
			contentType:String
		}
	},
	DateTime:Date,
	conversationId:Object	
},{timestamps:true},{"strict":false});

module.exports = mongoose.model("Message",MessageSchema);
module.exports = mongoose.model("Conversation",ConversationSchema);
