const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
    machineName: {
        type: String,
        required: true,
    },
    methodName: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: 'DepartmentSetupModel'
    },
    make: {
        type: String,
        required: true,
    },
    modelNumber: {
        type: String,
        required: true,
    },
    serialNumber: {
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

const MachineMasterModel = mongoose.model('MachineMaster', machineSchema);
module.exports = MachineMasterModel;
