const mongoose = require("mongoose");

const SystematicExaminationSchema = new mongoose.Schema({
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

const SystematicExaminationModel = mongoose.model('Systematic_Examination' , SystematicExaminationSchema);

module.exports = SystematicExaminationModel;