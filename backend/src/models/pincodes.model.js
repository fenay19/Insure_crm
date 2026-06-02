const mongoose = require('mongoose');

const pincodeSchema = new mongoose.Schema({
    PostOfficeName: {
        type: String,
        required: true,
    },
    Pincode: {
        type: String,
        lowercase: true,
    },
    City: {
        type: String,
        required: true,
    },
    District: {
        type: String
    },
    State: {
        type: String
    },
    Country: {
        type: String
    },
}, {
    versionKey: false
});

const PincodeModel = mongoose.model('Pincodes', pincodeSchema);
module.exports = PincodeModel;