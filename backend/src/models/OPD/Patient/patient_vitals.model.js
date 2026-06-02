const mongoose = require('mongoose');

const PatientVitalsSchema = new mongoose.Schema({
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
        ref: 'StaffConsultant'
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
});

const PatientVitalsModel = mongoose.model('Patient_Vitals' , PatientVitalsSchema);

module.exports = PatientVitalsModel;