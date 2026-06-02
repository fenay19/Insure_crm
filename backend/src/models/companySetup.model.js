const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    branchName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    registrationNumber: {
        type: String,
        required: true,
    },
}, { _id: false });

const pharmacyDetailSchema = new mongoose.Schema({
    pharmacyName: {
        type: String,
    },
    pharmacyAddress: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
    },
    gstNumber: {
        type: String,
    },
    logo: {
        data: String,
        contentType: String,
    },
}, { _id: false });

const companySetupSchema = new mongoose.Schema({
    hospitalName: {
        type: String,
        required: true,
    },
    hospitalAddress: {
        type: String,
        required: true,
    },
    Pincode: {
        type: String,
        required: true,
    },
    City: {
        type: String,
        required: true,
    },
    District: {
        type: String,
        required: true,
    },
    State: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
    },
    mobileNumber: {
        type: String,
    },
    landlineNumber: {
        type: String,
    },
    website: {
        type: String,
    },
    gst: {
        type: String,
    },
    hospitalRegistrationNumber: {
        type: String,
    },
    isPharmacy: {
        type: Boolean,
        default: false,
    },
    isPrimary: {
        type: Boolean,
        default: false,
    },
    hospitalLogo: {
        data: String,
        contentType: String,
    },
    headerImage: {
        data: String,
        contentType: String,
    },
    branchDetails: {
        type: [branchSchema],
        default: [],
    },
    pharmacyDetail: pharmacyDetailSchema,
}, {
    versionKey: false,
    timestamps: true,
});

const CompanySetupModel = mongoose.model('CompanySetup', companySetupSchema);
module.exports = CompanySetupModel;
