const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:  {type: String, required: true},
    rating: { type: Number,default:1.0},
    like: {type: Number},
    dislike: {type: Number},
    contact: {type: String},
    date: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Doctor',doctorSchema);