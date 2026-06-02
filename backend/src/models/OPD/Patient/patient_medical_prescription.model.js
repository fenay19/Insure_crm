const mongoose = require('mongoose');

const PatientMedicalPrescriptionSchema = new mongoose.Schema({
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
    prescription:{
        type:Array,
        default: [],
    },
    intentNumber: {
        type: String,
        required: false,
    },
    delete:{
        type:Boolean,
        default:false
    }
}, {
    versionKey: false,
    timestamps: true,
});

const PatientMedicalPrescriptionModel = mongoose.model('Patient_Medical_Prescription' , PatientMedicalPrescriptionSchema);

module.exports = PatientMedicalPrescriptionModel;