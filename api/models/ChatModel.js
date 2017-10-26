var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ChatSchema = new Schema({	
	// chatId:Object,
	// members:[{
	// 	emailid:String,
	// 	registration_id:String
	// }]
	members: [{ 
		employee :  {
                email : String,//mongoose.Schema.Types.ObjectId,
              //  ref : 'Employee'
            },
		registration_id:String,
        delivered : Boolean,
        read : Boolean,
        last_seen : Date
    }]
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
