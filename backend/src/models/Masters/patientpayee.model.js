const mongoose = require('mongoose');

const patientPayeeSchema = new mongoose.Schema({
    payeeName: {
        type: String,
        required:true
    },
    payeeParent: {
        type: String,
        required:true
    },
    payeeParentId: {
        type: mongoose.Types.ObjectId,
        ref: 'Payee_Parent_Group',
        // required:true
    },
    parentGroup: {
        type: String,
        required:true
    },
    parentGroupId: {
        type: mongoose.Types.ObjectId,
        ref: 'Parent_Group',
        // required:true
    },
    rateChart:{
        type:String,
        required:false
    },
    address: {
        type:String,
        required:false
    },
    licNo: {
        type:String,
    },
    dateIncorporate: {
        type:String,
        required:false
    },
    dateMou: {
        type:String,
        required:false
    },
    dateRenewal:{
        type:String,
        required:false
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

const PatientPayeeMasterModel = mongoose.model('Patient_Payee', patientPayeeSchema);
module.exports = PatientPayeeMasterModel;
