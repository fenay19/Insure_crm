const mongoose = require('mongoose');

const drugAllergySchema = new mongoose.Schema({
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

const DrugAllergyModel = mongoose.model('Drug_Allergy', drugAllergySchema);

module.exports = DrugAllergyModel;
