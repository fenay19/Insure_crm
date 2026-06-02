const mongoose = require('mongoose');

const EmergencyPatientChiefComplaintSchema = new mongoose.Schema({
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
    chiefComplaint:{
        type:Array,
        chiefComplaint:{
            type:String,
        },
        descreption:{
            type:String,
        },
        notes:{
            type:String,
        },
        since:{
            type:String,
        },
        symptoms:{
            type:Array,
            with:{
                type:String,
            },
        },
        treatment:{
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

const EmergencyPatientChiefComplaintModel = mongoose.model('Emergency_Patient_Chief_Complaint' , EmergencyPatientChiefComplaintSchema);

module.exports = EmergencyPatientChiefComplaintModel;