const mongoose = require('mongoose');

const SubLedgerSchema = new mongoose.Schema({
    ledger: {
        type: String,
        required: false
    },
    ledgerId: {
        type: mongoose.Types.ObjectId,
        ref: 'Ledger',
    },
    subLedger:{
        type: String,
        required: false
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

const SubLedgerModel = mongoose.model("Sub_Ledger", SubLedgerSchema);

module.exports = SubLedgerModel;