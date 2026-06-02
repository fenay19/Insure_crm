const mongoose = require('mongoose');

const TPACompanyMasterSchema = new mongoose.Schema({
    tpaCompanyName: {
        type: String,
        required: false
    },
    delete:{
        type: Boolean,
        default: false
    },
    deletedAt:{
        type: Date,
    },
},
{
    timestamps: true,
    versionKey: false
});

const TPACompanyMasterModel = mongoose.model("TPA_Company_Master", TPACompanyMasterSchema);

module.exports = TPACompanyMasterModel;