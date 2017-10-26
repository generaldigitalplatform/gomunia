var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ChatGroupSchema = new Schema({
	createdBy:String,
	chatId:String,
	notification_key_groupname:String,
	notification_key:String,
	notification_ids:[]
},{timestamps:true},{"strict":false})

module.exports = mongoose.model("ChatGroup",ChatGroupSchema);
