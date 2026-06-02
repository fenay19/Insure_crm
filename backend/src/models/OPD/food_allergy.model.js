const mongoose = require('mongoose');

const foodAllergySchema = new mongoose.Schema({
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

const FoodAllergyModel = mongoose.model('Food_Allergy', foodAllergySchema);

module.exports = FoodAllergyModel;
