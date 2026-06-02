const mongoose = require('mongoose');

const InstructionSchema = new mongoose.Schema({
    count:{
        type:Number,
        default:0,
    },
    heading:{
        type:String,
        required:false
    },
    // description:{
    //     type:Array,
    //     required: false,
    //     default: null
    // },
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

const InstructionModel = mongoose.model('Instruction', InstructionSchema);

module.exports = InstructionModel;
