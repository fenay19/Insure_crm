const mongoose = require('mongoose');

const PatientInstructionSchema = new mongoose.Schema({
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

const PatientInstructionModel = mongoose.model('Patient_Instruction' , PatientInstructionSchema);

module.exports = PatientInstructionModel;