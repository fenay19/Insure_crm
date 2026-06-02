const mongoose = require('mongoose');

const EmergencyPatientMedicalPrescriptionSchema = new mongoose.Schema({
    patientId:{
        type:mongoose.Types.ObjectId,
        ref: 'Patient_Appointment'
    },
    opdPatientId : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'OPD_patient',
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

const EmergencyPatientMedicalPrescriptionModel = mongoose.model('Emergency_Patient_Medical_Prescription' , EmergencyPatientMedicalPrescriptionSchema);

module.exports = EmergencyPatientMedicalPrescriptionModel;