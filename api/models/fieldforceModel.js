var mongoose = require('mongoose');

var FieldForceSchema = new mongoose.Schema({
    employeeid:{
        type: String,
        unique: true,
        required: true
    },
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String
    },
    primaryphone:{
        type: Number,
        unique: true,
        required: true
    },
    secondaryphone:{
        type: Number
    },
    email: {
        type: String,       
        unique: true,
        required: true
    },
    worklocations:[],
    workpincodes:[],   
},{
    timestamps: true
}, {strict:false});
  
module.exports = mongoose.model('FieldForce', FieldForceSchema);