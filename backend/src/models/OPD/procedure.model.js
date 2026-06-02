const mongoose = require('mongoose');

const ProcedureSchema = new mongoose.Schema({
    count:{
        type:Number,
        default:0,
    },
    surgery:{
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

const ProcedureModel = mongoose.model('Procedure', ProcedureSchema);

module.exports = ProcedureModel;
