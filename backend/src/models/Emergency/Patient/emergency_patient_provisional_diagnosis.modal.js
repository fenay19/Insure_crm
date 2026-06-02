const mongoose = require('mongoose');

const EmergencyPatientProvisionalDiagnosisSchema = new mongoose.Schema({
    patientId:{
        type:mongoose.Types.ObjectId,
        ref: 'patientDetails'
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

const EmergencyPatientProvisionalDiagnosisModel = mongoose.model('Emergency_Patient_Provisional_Diagnosis' , EmergencyPatientProvisionalDiagnosisSchema);

module.exports = EmergencyPatientProvisionalDiagnosisModel;