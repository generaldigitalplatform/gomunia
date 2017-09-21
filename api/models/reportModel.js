var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TelesalesReportsSchema = new Schema({
	TotalCall:Number,
	DeniedCall:Number,
	SuccessfulCall:Number	
},
{timestamps:true},
{"strict":false});

module.exports = mongoose.model('TelesalesReports',TelesalesReportsSchema);
