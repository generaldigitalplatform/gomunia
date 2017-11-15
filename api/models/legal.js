var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LegalSchema = new Schema({
	legal:String	
},{"strict":false});

module.exports = mongoose.model('Legal',LegalSchema);
