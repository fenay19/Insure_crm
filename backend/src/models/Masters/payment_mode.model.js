const mongoose = require('mongoose');

const PaymentModeSchema = new mongoose.Schema({
    paymentMode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    delete: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true,
    versionKey: false
});

const PaymentModeModel = mongoose.model('PaymentMode', PaymentModeSchema);

module.exports = PaymentModeModel;