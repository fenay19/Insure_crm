const mongoose = require('mongoose');

const opdSchema = new mongoose.Schema({
    user:String,
    tokenNumber:String,
    opdNumber:String,
    uhid:{
        type: String,
        required: true,
    },
    opdRegType: {
        type: String,
        required: true,
    },
    patientname: {
        type: String,
        required: true,
    },
    patientId: {
        type: mongoose.Types.ObjectId,
        ref: 'patientDetails',
    },
    thirdPartyName:{
        type: String,
        required: false,
        default: null,
    },
    govermentCompany: {
        type: String,
        required: false,
    },
    cooprateCompany:{
        type: String,
        required: false,
    },
    patientPayee:{
        type: String,
        required: true,
    },
    patientPayeeId: {
        type: mongoose.Types.ObjectId,
        re: 'Patient_Payee'
    },
    insuranceCompany: {
        type: String,
        required: false,
    },
    department: {
        type: String,
        required: true,
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: 'DepartmentSetup'
    },
    consultant: {
        type: String,
        required: true,
    },
    consultantId: {
        type: mongoose.Types.ObjectId,
        ref: 'StaffConsultant'
    },
    speciality:{
        type: String,
        required: false,
    },
    pkgType:{
        type: String,
        required: false,
    },
    pkgValidity:{
        type: String,
        required: false,
    },
    referBy:{
        type: String,
        required: false,
    },
    refferName:{
        type: String,
        required: false,
    },
    refferMobile:{
        type: String,
        required: false,
    },
    marketingCommunity:{
        type: String,
        required: false,
    },
    notes:{
        type: String,
        required: false,
    },
    patientIn :{
        type:Boolean,
        default:false
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
    billingStatus :{
        type: String,
        enum: ['Non_Paid', 'Paid', 'Partially_Paid'],
        default:'Non_Paid'
    },
    whoBookId: {
        type: mongoose.Types.ObjectId,
        ref: 'Admin',
    },
    whoBookName: {
        type: String,
        required: true,
    },
    confirmAppointment: {
        type: Boolean,
        default: false,
    },
    cancelAppointment: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['pending', 'out'],
        default: 'pending',
    },
    delete: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
    },
}, {
    versionKey: false,
    timestamps: true,
});

const OPDModel = mongoose.model('OPD', opdSchema);

module.exports = OPDModel;
