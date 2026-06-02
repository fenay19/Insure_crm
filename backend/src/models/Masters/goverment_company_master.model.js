const mongoose = require('mongoose');

const GovCompanyMasterSchema = new mongoose.Schema({
    govermentCompanyName: {
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

const GovCompanyMasterModel = mongoose.model("Goverment_Company_Master", GovCompanyMasterSchema);

module.exports = GovCompanyMasterModel;