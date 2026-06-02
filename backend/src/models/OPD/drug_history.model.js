const mongoose = require('mongoose');

const drugHistorySchema = new mongoose.Schema({
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

const DrugHistoryModel = mongoose.model('Drug_History', drugHistorySchema);

module.exports = DrugHistoryModel;
