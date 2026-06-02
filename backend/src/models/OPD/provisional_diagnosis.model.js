const mongoose = require('mongoose');

const ProvisionalDiagnosisSchema = new mongoose.Schema({
    count:{
        type:Number,
        default:0,
    },
    diagnosis:{
        type:String,
        required:false
    },
    code:{
        type: String,
        required: false
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: 'DepartmentSetup'
    },
    consultantId: {
        type: mongoose.Types.ObjectId,
        ref: 'StaffConsultant'
    },
    delete: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
    },
}, {
    versionKey: false,
    timestamps: true,
});
const ProvisionalDiagnosisModel = mongoose.model('Provisional_Diagonsis', ProvisionalDiagnosisSchema);

module.exports = ProvisionalDiagnosisModel;
