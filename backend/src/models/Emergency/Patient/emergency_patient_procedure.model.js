const mongoose = require("mongoose");

const EmergencyPatientProcedureSchema = new mongoose.Schema({
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
    notes:String,
    procedure:{
        type:Array,
        surgeryName:{
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

const EmergencyPatientProcedureModel = mongoose.model('Emergency_Patient_Procedure',EmergencyPatientProcedureSchema);

module.exports = EmergencyPatientProcedureModel;