var mongoose = require('mongoose'),
  	Schema = mongoose.Schema,
  	ObjectId = Schema.ObjectId; //not needed here, but may be needed in another model file



userSchema = new Schema({
    username: {type:String, required:true},
    city: String,
    email: {
        type:String, 
        required:true, 
        match:/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/
    },
    prestige: {type:Number, default:0},
    salt:String,
    password:String,
    reviews:[mongoose.Schema.Types.ObjectId],
    votedReviews:[mongoose.Schema.Types.ObjectId] //reviews on which the user has voted the helpfulness to prevent double votes
});


User = mongoose.model('users', userSchema); //name of collection is 'users'

module.exports = User;
