const mongoose = require('mongoose');

const LedgerSchema = new mongoose.Schema({
    ledgerType:{
        type: String,
        required: true
    },
    ledger: {
        type: String,
        required: true
    },
    delete:{
        type: Boolean,
        default: false
    },
    delete:{
        type: Boolean,
        default: false,
    },
    deletedAt:{
        type: Date,
    },
},
{
    timestamps: true,
    versionKey: false
});

const LedgerModel = mongoose.model("Ledger", LedgerSchema);

module.exports = LedgerModel;