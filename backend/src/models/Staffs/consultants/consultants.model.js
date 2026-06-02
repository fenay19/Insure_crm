const mongoose = require('mongoose');

const consultantSchema = new mongoose.Schema({
    basicDetails: {
        user:{
            type: mongoose.Types.ObjectId,
            ref:'Admin'
        },
        prefix:String,
        prefixId:{
            type: mongoose.Types.ObjectId,
            ref:'Prefix'
        },
        firstName: String,
        middleName: String,
        lastName: String,
        gender: String,
        fatherName: String,
        mobile: String,
        alternateMobile: String,
        email: String,
        alternateEmail: String,
        aadhar: String,
        // staffType: String,
        department:String,
        departmentId: {
            type: mongoose.Types.ObjectId,
            ref:'DepartmentSetup'
        },
        designation:String,
        designationId:{
            type: mongoose.Types.ObjectId,
            ref:'Designation'
        },
        dateOfJoining: Date,
        followUpDays:String,
        newFees:String,
        followUpFees:String, 
    },
    addressDetails: {
        address: String,
        pincode: String,
        state: String,
        city: String,
        district: String,
        country: String,
        permanentAddress: String,
        permanentPincode: String,
        permanentState: String,
        permanentCity: String,
        permanentDistrict: String,
        permanentCountry: String,
    },
    educationalDetails: {
        SSC: {
            degree: String,
            institute: String,
            year: String,
            CGPA: String,
        },
        HSC: {
            degree: String,
            institute: String,
            year: String,
            CGPA: String,
        },
        graduation: {
            degree: String,
            institute: String,
            year: String,
            CGPA: String,
        },
        postGraduation: {
            degree: String,
            institute: String,
            year: String,
            CGPA: String,
        },
        other: {
            degree: String,
            institute: String,
            year: String,
            CGPA: String,
        },
    },
    bankingDetails: {
        accountNumber: String,
        bankName: String,
        branchName: String,
        ifscCode: String,
        panNumber: String,
        accountHolderName: String,
    },
    documents: {
        aadharCard: String,
        panCard: String,
        passbook: String,
        photo: String,
        joining: String,
        revealing: String,
        SSC: String,
        HSC: String,
        graduation: String,
        postGraduation: String,
        other: String,
        sign:String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
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

const ConsultantModel = mongoose.model('StaffConsultant', consultantSchema);

module.exports = ConsultantModel
    