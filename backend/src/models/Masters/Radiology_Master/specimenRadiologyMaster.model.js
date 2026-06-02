const mongoose = require('mongoose');

const specimenMasterSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    delete: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }
},{
    timestamps: true,
    versionKey: false
});

const SpecimenRadiologyMasterModel = mongoose.model('SpecimenRadiologyMaster', specimenMasterSchema);
module.exports = SpecimenRadiologyMasterModel;
