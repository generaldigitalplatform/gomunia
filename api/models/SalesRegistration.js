var mongoose = require('mongoose');
 
var SalesRegistrationSchema = new mongoose.Schema({
    company: {
        type: String,
    },
    name: {
        type: String,
        required: true
    }, 
    contactnumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    }
 
},{strict:false}, {
    timestamps: true
});
  
module.exports = mongoose.model('SalesRegistration', SalesRegistrationSchema);