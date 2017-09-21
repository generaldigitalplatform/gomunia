var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var ReasonSchema = new Schema({
	Title:String	
},{"strict":false});

module.exports = mongoose.model('Reason',ReasonSchema);
