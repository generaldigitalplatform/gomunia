var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedbackSchema = new Schema({
	Rating:Number,
	Feedback:String,
	TaskId:Number,
	CustomerId:Object,
	EmployeeId:Object	
},{"strict":false});

module.exports = mongoose.model('Feedback',FeedbackSchema);
