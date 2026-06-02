const mongoose = require("mongoose");

const PatientExaminationSchema = new mongoose.Schema({
    patientId:{
        type:mongoose.Types.ObjectId,
        ref: 'Patient_Appointment'
    },

    opdPatientId :  {
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
    local:{
        type:Array,
        disorder:String,
        subDisorder:{
            type:Array,
            name:String,
        },
        notes:String,
        diagram:String,
    },
    general:{
        type:Array,
        disorder:String,
        subDisorder:{
            type:Array,
            name:String,
        },
        notes:String,
    },
    systematic:{
        type:Array,
        disorder:String,
        subDisorder:{
            type:Array,
            name:String,
        },
        notes:String,
        diagram:String,
    },
    other:{
        type:Array,
        exam:String,
        notes:String,
    },
    delete:{
        type:Boolean,
        default:false
    }
}, {
    versionKey: false,
    timestamps: true,
});

const PatientExaminationModel = mongoose.model('Patient_Examination' , PatientExaminationSchema);

module.exports = PatientExaminationModel;