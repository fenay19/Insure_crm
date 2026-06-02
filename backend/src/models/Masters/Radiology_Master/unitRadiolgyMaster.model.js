const mongoose = require('mongoose');

const unitRadiologySchema = new mongoose.Schema({
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

const UnitRadiologyMasterModel = mongoose.model('UnitRadiologyMaster', unitRadiologySchema);
module.exports = UnitRadiologyMasterModel;
