const mongoose = require('mongoose');

const EmergencyPatientVitalsSchema = new mongoose.Schema({
    patientId:{
        type:mongoose.Types.ObjectId,
        ref: 'emergencyRegistration'
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: 'DepartmentSetup'
    },
    consultantId: {
        type: mongoose.Types.ObjectId,
        ref: 'Consultant'
    },
    vitals:{
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
})

const EmergencyPatientVitalsModel = mongoose.model("Emergency_patient_vitals", EmergencyPatientVitalsSchema);
module.exports = EmergencyPatientVitalsModel;
