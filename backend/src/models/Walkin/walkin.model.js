const { required } = require('joi');
const mongoose = require('mongoose');

const walkinSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Types.ObjectId,
        ref: "patientDetails",
        required: true
    },

    services: [
        {
            refId: {
                type: mongoose.Types.ObjectId,
                ref: "ServiceDetailsMaster",
                required: true
            },
            type: {
                type: String,
                required: true
            },
            charges: {
                type: Number,
                default: 0
            },
            discountCharges: {
                type: Number,
                default: 0
            },
            serviceName: {
                type: String
            }
        }
    ],

    charges: {
        type: Number,
        default: 0,
        required: true
    },

    transactionId: {
        type: String,
    },

    cardNo: {
        type: String
    },

    cardPersonName: {
        type: String
    },

    discountCharges: {
        type: Number,
        default: 0,
        required: true,
    },

    paidAmount: {
        type: Number,
        default: 0,
        required: true,
    },

    finalAmount: {
        type: Number,
        default: 0,
        required: true
    },

    payType: {
        type: String
    },

    paymentMode: {
        type: String,
    },

    paymentModeId: {
        type: String
    },

    walkInNumber: {
        type: String,
    },

    uhid: {
        type: String,
        required: true
    },

    whoBookId: {
        type: String
    },

    whoBookName: {
        type: String
    },

    billingStatus: {
        type: String,
        default: "Non_Paid",
        enum: ["Non_Paid", "Partially_Paid", "Paid"]
    },

    invoiceNo: {
        type: String,
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

const WalkinModel = mongoose.model('Walkin', walkinSchema);

module.exports = WalkinModel;
