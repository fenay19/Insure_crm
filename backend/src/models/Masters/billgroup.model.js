const mongoose = require('mongoose');

const billGroupSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref:'Admin'
    },
    billGroupName: {
        type: String,
        required: true,
    },
    billGroupCode: {
        type: String,
        required: true,
    },
    // accountLedger: { type: String },
    ledger:{ type:String,required: false },
    ledgerId:{type: mongoose.Types.ObjectId, ref:'Ledger'},
    subLedger: { type: String },
    subLedgerId:{ type: mongoose.Types.ObjectId, ref:'Sub_Ledger'},
    description: { type: String },
    forAll:Boolean,
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
}, {
    versionKey: false,
    timestamps: true,
});

const BillGroupModel = mongoose.model('BillGroup', billGroupSchema);
module.exports = BillGroupModel
