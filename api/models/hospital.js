const mongoose = require('mongoose');
const review = require('./doctor');

const hospitalSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:  {type: String, required: true},
    rating: {type: Number, default: 1},
    like: {type: Number},
    dislike: {type: Number},
    date: {type: Date, default: Date.now()},
    hospital_id: {type: Number},
    address: {type: String},
    contact: {type: String},
    verified: {type: Boolean, default:false}
    

});

module.exports = mongoose.model('Hospital',hospitalSchema);