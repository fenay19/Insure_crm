const mongoose = require('mongoose');

const EmergencyPatientFollowUpSchema = new mongoose.Schema({
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
    followUp:{
        type:String,
        required:false,
    },
    advice:{
        type:String,
        required:false,
        default:null,
    },
    delete:{
        type:Boolean,
        default:false
    }
}, {
    versionKey: false,
    timestamps: true,
});

const EmergencyPatientFollowUpModel = mongoose.model('Emergency_Patient_Follow_Up',EmergencyPatientFollowUpSchema);

module.exports = EmergencyPatientFollowUpModel;