var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CustomerFeedbackSchema = new Schema({
	CustomerId:Object,
	CollectedBy:String,
	Industry:[{
		Name:String,
		Company:[{
		Name:String,
			Product:[{
				Name:String,
				ProductFeedback:[{
					ProductsUsageDetails:[{

					}],
					ProductsInterestedDetails:[{
						
					}],
					ProductsNotInterestedDetails:[{
						
					}],
					ProductsInterestedCallbackDetails:[{
						
					}],
					ProductsNotInterestedCallbackDetails:[{
						
					}]

				}]
			}],
		}],	
	}],
},{
    timestamps: true
},{	"strict":false});

module.exports = mongoose.model('CustomerFeedback',CustomerFeedbackSchema);
