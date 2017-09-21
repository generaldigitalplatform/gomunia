var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProductTypesSchema = new Schema({
	ProductType:String,
	ProductName:String,
	ProductUsage:[
	{
		x:String,
		y:String
	}	
	]
},{"strict":false});

var AboutProductUsageSchema = new Schema({
	Inductry:String,
	Product:String,
	ProductTypes:[ProductTypesSchema]
},{"strict":false});

module.exports = mongoose.model('AboutProductUsage',AboutProductUsageSchema);
