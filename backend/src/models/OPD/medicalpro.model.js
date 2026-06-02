const mongoose = require('mongoose');

const medicalProblemSchema = new mongoose.Schema({
    medicalCount:{
        type:Number,
        default:0,
    },
    familyCount:{
        type:Number,
        default:0,
    },
    problem:{
        type:String,
        required:false
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

const MedicalProblemModel = mongoose.model('Medical_Problem', medicalProblemSchema);

module.exports = MedicalProblemModel;
