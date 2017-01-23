var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId; //not needed here, but may be needed in another model file


reviewSchema = new Schema({
    creator: mongoose.Schema.Types.ObjectId,
    dateCreated: {type:Date, default:Date.now},	
    dateVisited: Date,	
    reviewText: String,
    helpful: Number
});


Review = mongoose.model('review', reviewSchema); //name of collection is 'users'

module.exports = Review;
