const mongoose = require("mongoose");

const GeneralExaminationSchema = new mongoose.Schema({
    exam: {
        disorder: String,
        subDisorder: [{
            name: String,
            count: { type: Number, default: 0 },
            answerType: String,
            objective: {
                type: Array,
                default: [],
            },
        }],
        diagram:String,
    },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    consultantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultant' },
    delete: { type: Boolean, default: false }
}, { timestamps: true });

const GeneralExaminationModel = mongoose.model('General_Examination' , GeneralExaminationSchema);

module.exports = GeneralExaminationModel;