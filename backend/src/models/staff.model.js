const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    refId:{
        type: mongoose.Types.ObjectId,
    },
    refType : {
        type : String,
    },
    role: {
        type: String,
    },
    roleId: {
        type: mongoose.Types.ObjectId,
        ref: 'Roles'
    },
    isBlocked: {
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

const StaffModel = mongoose.model('Staff', staffSchema);

module.exports = StaffModel;
