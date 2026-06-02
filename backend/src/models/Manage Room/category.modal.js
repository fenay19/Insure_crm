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