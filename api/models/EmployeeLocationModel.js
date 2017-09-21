var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var EmployeeLocationSchema = new Schema({
	EmployeeId:Object,	
	Status:String,
	CurrentLocation:[{
	    type: {
	      type: "String",
	      required: true,
	      enum: ['Point', 'LineString', 'Polygon'],
	      default: 'Point'
	    },
   	Coordinates: {
        type: [Number],
    Area:String,
    TrackDateTime:Date
    }
}]
},{
    timestamps: true
},{"strict":false});

EmployeeLocationSchema.index({ 'CurrentLocation': '2dsphere' });
module.exports = mongoose.model('EmployeeLocation',EmployeeLocationSchema);
