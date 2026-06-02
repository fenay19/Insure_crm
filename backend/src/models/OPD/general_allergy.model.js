const mongoose = require('mongoose');

const generalAllergySchema = new mongoose.Schema({
    count:{
        type:Number,
        default:0,
    },
    allergyName:{
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

const GeneralAllergyModel = mongoose.model('General_Allergy', generalAllergySchema);

module.exports = GeneralAllergyModel;
