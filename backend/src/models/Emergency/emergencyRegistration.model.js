const mongoose = require("mongoose");

const EmergencyRegisterSchema = new mongoose.Schema({
    uhid: {
        type: String,
    },
    dateArrivals: {
        type: String,
    },
    massCasuality: {
        type: Boolean,
        default: false,
    },
    patientId: {
        type: mongoose.Types.ObjectId,
        ref: 'patientDetails',
    },
    prefix: {
        type: String,
    },
    prefixId: {
        type: String,
    },
    patientname: {
        type:String,
    },
    mobileNo: {
        type: Number,
    },
    dob: {
        type: String,
        default: null,
    },
    age: {
        type: Number,
    },
    weight: {
        type: Number,
    },
    gender: {
        type: String,
    },
    occupation: {
        type: String,
    },
    patientResidence: {
        type: String,
    },
    arrivalMode: {
        type: String,
    },
    noOfPriorFacilities: {
        type: String,
    },
    referBy: {
        type: String,
    },
    refferName: {
        type: String,
    },
    refferMobile: {
        type: Number,
    },
    ambulatory: {
        type: String,
    },
    contactPersonPrefix: {
        type: String,
    },
    contactPerson: {
        type: String,
    },
    contactPersonNo: {
        type: Number,
    },
    contactPersonRelation: {
        type: String,
    },
    consultants: [],
    emergencyNo: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'out'],
        default: 'pending',
    },
    billingStatus: {
        type: String,
        enum: ['Non_Paid', 'Paid', 'Partially_Paid'],
        default: 'Non_Paid',
    },
    whoBookId: {
        type: mongoose.Types.ObjectId,
        ref: 'Admin',
    },
    whoBookName: {
        type: String,
    },
    patientIn: {
        type: Boolean,
        default: false,
    },
    totalAmount: {
        type: Number,
        default: 0,
    },
    discountAmount: {
        type: Number,
        default: 0,
    },
    paidAmount: {
        type: Number,
        default: 0,
    },
    finalAmount: {
        type: Number,
        default: 0,
    },
    delete:{
        type:Boolean,
        default:false
    }
}, {
    timestamps: true,
    versionKey: false,
});

const EmergencyRegisterModel = mongoose.model("emergencyRegistration", EmergencyRegisterSchema);

module.exports = EmergencyRegisterModel;
