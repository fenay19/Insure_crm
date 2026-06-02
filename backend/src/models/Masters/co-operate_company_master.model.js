const mongoose = require('mongoose');

const copperateCompanyMasterSchema = new mongoose.Schema({
    cooperativeCompanyName: {
        type: String,
        required: false
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

const CoOperateCompanyMasterModel = mongoose.model("Co-Operate_Company_Master", copperateCompanyMasterSchema);

module.exports = CoOperateCompanyMasterModel;