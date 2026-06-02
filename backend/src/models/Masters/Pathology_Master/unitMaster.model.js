const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
    name: {
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

const UnitMasterModel = mongoose.model('UnitMaster', unitSchema);
module.exports = UnitMasterModel;
