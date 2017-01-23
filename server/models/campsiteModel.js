var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId; //not needed here, but may be needed in another model file


campsiteSchema = new Schema({
    name: String,
    creator: mongoose.Schema.Types.ObjectId,
    rating: Number,	//1-5
    dateCreated: Date,
    directions: String,
    description: String,
    price: Number,		//dollars
    lng: Number,
    lat: Number,	//geo coords
    size: Number,	//number of tents (idk)
    type: Number,	//1,2,3 enumerated
    tags:[String],
    fire: Boolean,
    reviews:[mongoose.Schema.Types.ObjectId]
});

Campsite = mongoose.model('campsites', campsiteSchema); //name of collection is 'users'

module.exports = Campsite;
