const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'Admin'
    },
    prefix: String,
    prefixId: {
        type: mongoose.Types.ObjectId,
        ref: 'Prefix'
    },
    patientname: {
        type: String,
        default: null
    },
    age: {
        type: String,
        default: null
    },
    gender: {
        type: String,
        default: null
    },
    contact: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    country: {
        type: String,
        default: null
    },
    state: {
        type: String,
        default: null
    },
    city: {
        type: String,
        default: null
    },
    pincode: {
        type: String,
        default: null
    },
    is_provisional: {
        type: Boolean,
        default: true
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
    versionKey: false,
});

const PatientModel = mongoose.model('Patient', patientSchema);
module.exports = PatientModel;