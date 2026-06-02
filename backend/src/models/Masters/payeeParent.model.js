const mongoose = require('mongoose');

const payeeParentGroupSchema = new mongoose.Schema({
    payeeParentName: {
        type: String,
    },
    parentGroup: {
        type: String,
    },
    parentGroupId: {
        type: mongoose.Types.ObjectId,
        ref: 'Parent_Group',
    },
    rateChart:{
        type:String,
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

const PayeeParentGroupMasterModel = mongoose.model('Payee_Parent_Group', payeeParentGroupSchema);
module.exports = PayeeParentGroupMasterModel;
