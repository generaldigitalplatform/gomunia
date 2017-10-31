var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ChatSchema = new Schema({	
	// chatId:Object,
	// members:[{
	// 	emailid:String,
	// 	registration_id:String
	// }]
	createdBy:{
		email : String,
        firstname:String,
        lastname:String,
        primaryphone:Number,
        employeeid:String,
        employerid:String
	},
	//members: { 
		member :  [{
				//type: Schema.Types.ObjectId,ref : 'Employee'},
              email : String,
              firstname:String,
        	  lastname:String,
        	  primaryphone:Number,
        	  employerid:String,
	    	    employeeid:String,
	    	  	registration_id:String,
		        delivered : Boolean,
		        read : Boolean,
		        last_seen : Date

           }]
	
   // }
	// members : [
 //        {
 //            user :  {
 //                type : mongoose.Schema.Types.ObjectId,
 //                ref : 'Employee'
 //    //             //emailid:String,
	// 			// //registration_id:String
 //            },
 //            // email_id:String,
 //            registration_id:String,
 //            delivered : Boolean,
 //            read : Boolean,
 //            last_seen : Date
 //        }
 //    ]
},{timestamps:true},{"strict":false})

module.exports = mongoose.model("Chat",ChatSchema);
