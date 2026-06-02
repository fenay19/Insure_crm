const mongoose = require('mongoose');

const FinalDiagnosisSchema = new mongoose.Schema({
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
        ref: 'Consultant'
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
const FinalDiagnosisModel = mongoose.model('Final_Diagonsis', FinalDiagnosisSchema);

module.exports = FinalDiagnosisModel;
