var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ConversationSchema = new Schema({
	conversationId:Object,
	members:[]
},{timestamps:true},{"strict":false})

module.exports = mongoose.model("Conversation",ConversationSchema);
