const mongoose = require('mongoose');

const PatientProvisionalDiagnosisSchema = new mongoose.Schema({
    patientId:{
        type:mongoose.Types.ObjectId,
        ref: 'Patient_Appointment'
    },
    opdPatientId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'OPD_patient'
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: 'DepartmentSetup'
    },
    consultantId: {
        type: mongoose.Types.ObjectId,
        ref: 'Consultant'
    },
    diagnosis:{
        type:Array,
        diagnosis:{
            type:String,
        },
        code:{
            type:String,
        },
    },
    delete:{
        type:Boolean,
        default:false
    }
}, {
    versionKey: false,
    timestamps: true,
});

const PatientProvisionalDiagnosisModel = mongoose.model('Patient_Provisional_Diagnosis' , PatientProvisionalDiagnosisSchema);

module.exports = PatientProvisionalDiagnosisModel;