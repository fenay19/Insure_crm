const mongoose = require("mongoose");

const  patientPresentIllness = new mongoose.Schema({
    patientId:{
        type:mongoose.Types.ObjectId,
        ref: 'OPD_Patient'
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: 'DepartmentSetup'
    },
    consultantId: {
        type: mongoose.Types.ObjectId,
        ref: 'Consultant'
    },
    presentIllness:{
        type:Array,
        default: [],
    },
    delete:{
        type:Boolean,
        default:false
    }
}, {
    versionKey: false,
    timestamps: true,
});

const PatientPresentIllnessHistoryModel = mongoose.model('Patient_Present_Illness-History',patientPresentIllness);

module.exports = PatientPresentIllnessHistoryModel;