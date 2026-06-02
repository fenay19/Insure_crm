const mongoose = require('mongoose');

const CategoryMasterSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref: 'Admin'
    },
    categoryName: {
        type: String,
        required: true,
    }, 
    categoryId:{
        type: mongoose.Types.ObjectId,
        ref: 'CategoryMasterModel',
        required: true,
    }, 
    bedNo: {
        type: String,
        required: true,
    },
    bedNoId: {
        type: mongoose.Types.ObjectId,
        ref: 'BedMasterModel',
        required: true,
    },
    roomNo:{
        type: String,
        required: true,
    },
    roomNoId: {
        type: mongoose.Types.ObjectId,
        ref: 'room_no',
        required: true,
    },
    delete: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
    },
    }, {
timestamps: true,
versionKey: false,
});

const CategoryMasterModel = mongoose.model('category_master', CategoryMasterSchema);
module.exports = CategoryMasterModel