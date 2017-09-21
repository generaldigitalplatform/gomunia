var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmployeeProfileSchema = new Schema({
	FirstName:String,
	LastName:String,
	PrimaryPhone:String,
	SecondaryPhone:String,	
	ContactAddress:[{
		DoorNumber:String,
		BuildingNumber:String,
		BuildingName:String,
		Street:String,
		Area:String,
		City:String,
		Taluk:String,
		District:String,
		State:String,
		Pincode:String,
		Landmark:String
	}],
	PermanentAddress:[{
		DoorNumber:String,
		BuildingNumber:String,
		BuildingName:String,
		Street:String,
		Area:String,
		City:String,
		Taluk:String,
		District:String,
		State:String,
		Pincode:String,
		Landmark:String
	}],
	SocialCommunication:[{
		Email:String,
		WhatsApp:String,
		Facebook:String,
		Twitter:String		
	}],	
	EducationDetails:[{
		Degree:String,
		College:String,
		University:String,
		Year:String			
	}],
	WorkInfo:[{
		EmployeeId:String,
		Company:String,
		Department:String,
		Role:String,
		Manager:String,
		MobileNumber:Number,
		LandLine:Number,
		WorkLocation:[{
			Name:String,
			Area:[],
			Pincode:[]
		}],		
		JoingDate:Date,
		LastDate:Date,
		Remarks:String			
	}]
},{
    timestamps: true
},{"strict":false});

module.exports = mongoose.model('EmployeeProfile',EmployeeProfileSchema);
