var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ChatGroupSchema = new Schema({
	notification_key_name:String
	notification_key:String,
	registration_ids:[]
},{timestamps:true},{"strict":false})

module.exports = mongoose.model("ChatGroup",ChatGroupSchema);
