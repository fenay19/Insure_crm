const mongoose = require('mongoose');

const ChiefComplaintSchema = new mongoose.Schema({
    count:{
        type:Number,
        default:0,
    },
    chiefComplaint:{
        type:String,
        required:false
    },
    symptoms:{
        type:Array,
        required: false,
        default: null
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: 'DepartmentSetup'
    },

    description:{
        type: Array,
        required: false,
        default: [],
    },
    since: {
        type:Array,
        required: false,
        default: [],
    },
    treatment:{
        type: Array,
        required: false,
        default: [],
    },
    isLocation:{
        type: Boolean,
        default: false,
    },
    isScale:{
        type: Boolean,
        default: false,
    },
    Location:{
        type: Array,
        required: false,
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
const ChiefComplaintModel = mongoose.model('Chief_complaint', ChiefComplaintSchema);

module.exports = ChiefComplaintModel;
