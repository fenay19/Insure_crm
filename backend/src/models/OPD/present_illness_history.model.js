const mongoose = require('mongoose');

const presentIllnessHistorySchema = new mongoose.Schema({
    count:{
        type:Number,
        default:0,
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: 'DepartmentSetup'
    },
    consultantId: {
        type: mongoose.Types.ObjectId,
        ref: 'StaffConsultant'
    },
    answerType: {
        type: String,
        required: true
    },
    problem: {
        type: String,
        required: true
    },
    objective: {
        type: Array,
        default:[],
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
const PresentIllnessHistoryModel = mongoose.model('Present_Illness_History', presentIllnessHistorySchema);

module.exports = PresentIllnessHistoryModel;
