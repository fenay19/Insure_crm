const mongoose = require('mongoose');

const parentGroupSchema = new mongoose.Schema({
    parentGroupName: {
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
    versionKey: false,
    timestamps: true,
});

const ParentGroupMasterModel = mongoose.model('Parent_Group', parentGroupSchema);
module.exports = ParentGroupMasterModel;
