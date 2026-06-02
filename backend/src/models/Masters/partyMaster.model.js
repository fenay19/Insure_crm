const mongoose = require('mongoose');

const partyMasterSchema = new mongoose.Schema({
    partyName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        require: true,
    },
    gst: {
        type: String,
        require: true,
    },
    pan: {
        type: String,
        require: true,
    },
    tan: {
        type: String,
        require: true,
    },
    bankName: {
        type: String,
        require: true,
    },
    bankAccountNo: {
        type: String,
        require: true,
    },
    ifsc: {
        type: String,
        require: true,
    },
    delete: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
    },
}, {
    timestamps: true,
    versionKey: false
});

const PartyMasterModel =  mongoose.model('PartyMaster', partyMasterSchema);

module.exports = PartyMasterModel;