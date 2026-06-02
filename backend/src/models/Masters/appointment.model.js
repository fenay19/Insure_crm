const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    fromTime: {
        type: String,
        // required: true,
    },
    toTime: {
        type: String,
        // required: true,
    },
});

const appointmentSchedulingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'Admin',
        },
        doctorName: {
            type: String,
            required: true,
        },
        doctorId: {
            type: mongoose.Types.ObjectId,
            ref: 'Consultant',
        },
        departmentName: {
            type: String,
            required: true,
        },
        departmentId: {
            type: mongoose.Types.ObjectId,
            ref: 'DepartmentSetupModel',
        },
        slotA: {
            type: slotSchema,
            // required: true,
        },
        slotB: {
            type: slotSchema,
            // required: true,
        },
        timeInterval: {
            type: String,
        },
        modes:[],
        instructions:{
            type: String,
            required: true,
        }, 
        month:[],
        schedule:[],
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        delete: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const AppointmentSchedulingModel = mongoose.model('AppointmentScheduling', appointmentSchedulingSchema);

module.exports = AppointmentSchedulingModel;
