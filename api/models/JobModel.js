var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

var JobSchema = new Schema({
	JobDates:String,
	JobId:Number,
	JobTitle:String,
	JobDescription:String,
	JobScheduledTime:Date,
	JobCreatedTime:Date,
	JobDoneTime:Date,
	JobCancelTime:Date,
	JobLocation:String,
	JobStatus:Number,
	JobTimelineStatus:String,
	JobRating:Number,
	JobFeedback:String,
	JobCreatedBy:String,
	EmployeeDetails:{
		FirstName:String,
		LastName:String,
		EmployeeId:String,
		Email:String,
		PrimaryPhone:Number,
		SecondaryPhone:Number,
		EmployerId:String		
	},
	CustomerDetails:{
		FirstName:String,
		LastName:String,
		PrimaryPhone:Number,
		SecondaryPhone:Number,		
		Location:String,
		Address:String		
	},
	StartedLocation: {
	    // type: {
	    //   type: "String",
	    //   required: true,
	    //   enum: ['Point', 'LineString', 'Polygon'],
	    //   default: 'Point'
	    // },
	   Coordinates:[Number],
	    Area:String,
	    DateTime:Date
	},
	ReachedLocation: {
	    // type: {
	    //   type: "String",
	    //   required: true,
	    //   enum: ['Point', 'LineString', 'Polygon'],
	    //   default: 'Point'
	    // },
	  Coordinates:[Number],
	    Area:String,
	    DateTime:Date	
	},
	CancelledLocation: {
	    // type: {
	    //   type: "String",
	    //   required: true,
	    //   enum: ['Point', 'LineString', 'Polygon'],
	    //   default: 'Point'
	    // },
	    Coordinates:[Number],
	    Area:String,
	    DateTime:Date	
	}
},
{
    timestamps: true
},{"strict":false});
//JobSchema.index({ 'StartedLocation': '2dsphere','ReachedLocation': '2dsphere','CancelledLocation': '2dsphere' });
module.exports = mongoose.model('Job',JobSchema);
