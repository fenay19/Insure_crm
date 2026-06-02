const mongoose = require('mongoose');

const nutritionalHistorySchema = new mongoose.Schema({
    count:{
        type:Number,
        default:0,
    },
    consultantId: {
        type: mongoose.Types.ObjectId,
        ref: 'Consultant'
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

const NutritionalHistoryModel = mongoose.model('Nutritional_History', nutritionalHistorySchema);

module.exports = NutritionalHistoryModel;
