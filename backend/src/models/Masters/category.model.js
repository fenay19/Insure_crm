const mongoose = require('mongoose');

const categoryMasterSchema = new mongoose.Schema({
    patientCategory: {
        type: String,
        required:true
    },
    patientPayee: {
        type: String,
        required:true
    },
    patientPayeeId: {
        type: mongoose.Types.ObjectId,
        ref: 'Patient_Payee',
        required:true
    },
    parentPayee: {
        type: String,
        required:true
    },
    parentPayeeId: {
        type: mongoose.Types.ObjectId,
        ref: 'Payee_Parent_Group',
        required:true
    },
    parentGroup: {
        type: String,
        required:true
    },
    parentGroupId: {
        type: mongoose.Types.ObjectId,
        ref: 'Parent_Group',
        required:true
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

const CategoryMasterModel = mongoose.model('Category_master', categoryMasterSchema);
module.exports = CategoryMasterModel;
