const mongoose = require('mongoose');

const EmergencyPatientInstructionSchema = new mongoose.Schema({
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
    instruction:{
        type:Array,  
        descreption:{
            type:Array,
        },
        heading:{
            type:String,
        }
    },
    delete:{
        type:Boolean,
        default:false
    }
}, {
    versionKey: false,
    timestamps: true,
});

const EmergencyPatientInstructionModel = mongoose.model('Emergency_Patient_Instruction' , EmergencyPatientInstructionSchema);

module.exports = EmergencyPatientInstructionModel;