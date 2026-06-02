const mongoose = require('mongoose');

const machineRadiologySchema = new mongoose.Schema({
    machineName: {
        type: String,
        required: false,
    },
    methodName: {
        type: String,
        required: false,
    },
    department: {
        type: String,
        required: false,
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: 'DepartmentSetupModel'
    },
    make: {
        type: String,
        required: false,
    },
    modelNumber: {
        type: String,
        required: false,
    },
    serialNumber: {
        type: String,
        required: false,
        unique:false
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
    timestamps: false,
});

const MachineRadiologyMasterModel = mongoose.model('MachineRadiologyMaster', machineRadiologySchema);
module.exports = MachineRadiologyMasterModel;
