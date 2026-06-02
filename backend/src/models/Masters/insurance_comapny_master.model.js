const mongoose = require('mongoose');

const InsuranceCompanyMasterSchema = new mongoose.Schema({
    // tpaCompanyName: {
    //     type: String,
    //     required: false
    // },
    // tpaCompanyId:{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'TPA_Company_Master',
    // },
    insuranceCompanyName: {
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

const InsuranceCompanyMasterModel = mongoose.model("Insurance_Company_Master", InsuranceCompanyMasterSchema);

module.exports = InsuranceCompanyMasterModel;