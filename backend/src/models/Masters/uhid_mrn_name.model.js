const mongoose = require("mongoose");

const nameSchema = new mongoose.Schema({
    name: { 
        type: String 
    },
    delete:{
        type:Boolean,
        default:false
    },
},{
    timestamps: true,
    versionKey: false,
});

const UHID_MRN_Model = mongoose.model('UHID_MRN_Name',nameSchema);

module.exports = UHID_MRN_Model;