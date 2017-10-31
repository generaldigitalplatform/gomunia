var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = require('mongoose').Types.ObjectId;

var MessageSchema = new Schema({
	chatId: {
	    type: Schema.Types.ObjectId,
	    required: true
    },
	author : {
        //type : mongoose.Schema.Types.ObjectId,
        //ref : 'Employee'
        email:String,
        firstname:String,
        lastname:String,
        employerid:String,
        primaryphone:Number

	 //	registration_id:String
    },
    messagePayload: {
	    messageType : String,
	    message:String,
	    receiver:{
	    	email:String,
	    	firstname:String,
	    	lastname:String,
	    	registration_id:String,
	    	read:Boolean,
	    	delivered : Boolean,
	    	last_seen:Date
	    }
	},
  	
 },{timestamps:true},{"strict":false});

module.exports = mongoose.model("Message",MessageSchema);

	// sender:{
	// 	email_id:String,
	// 	registration_id:String
	// },
	// receiver:{
	// 	email_id:String,
	// 	registration_id:String
	// },
	//author:String,
	//message:String
	//time_created:Date
	
    // body : 
    //     {
    //         message : String,
    //         delivered : Boolean,
    //         read : Boolean
            // meta : [
            //     {
            //         user : {
            //             type : mongoose.Schema.Types.ObjectId,
            //             ref : 'employees'
            //         },
            //         delivered : Boolean,
            //         read : Boolean
            //     }
            // ]
    //    },    
    //is_group_message : { type : Boolean, default : false },
	// participants : [
 //        {
 //            user :  {
 //                type : mongoose.Schema.Types.ObjectId,
 //                ref : 'User'
 //            },
 //            delivered : Boolean,
 //            read : Boolean,
 //            last_seen : Date
 //        }
 //    ],	

