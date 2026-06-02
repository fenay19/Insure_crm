const mongoose = require('mongoose');

const RiskFactorSchema = new mongoose.Schema({
    count:{
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

const  RiskFactorModel = mongoose.model('Risk_Factor', RiskFactorSchema);

module.exports = RiskFactorModel;
