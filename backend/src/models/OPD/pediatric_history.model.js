const mongoose = require('mongoose');

const PediatricHistorySchema = new mongoose.Schema({
    count:{
        type:Number,
        default:0,
    },
    consultantId: {
        type: mongoose.Types.ObjectId,
        ref: 'StaffConsultant'
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: 'DepartmentSetup'
    },
    answerType: {
        type: String,
        required: true,
    },
    problem:{
        type: String,
        required: true,
    },
    objective: {
        type: Array,
        default: [],
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

const PediatricHistoryModel = mongoose.model('Pediatric_History', PediatricHistorySchema);

module.exports = PediatricHistoryModel;
