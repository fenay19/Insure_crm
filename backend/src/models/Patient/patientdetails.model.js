const mongoose = require('mongoose');

const patientDetailsSchema = new mongoose.Schema({
    prefix:String,
    prefixId:{
        type: mongoose.Types.ObjectId,
        ref:'Prefix'
    },
    patientname:String,
    dob:String,
    age:String,
    birth_time:String,
    mobile_no:String,
    gender: String,
    maritalStatus:String,
    nationality:String,
    country: String,
    state: String,
    district: String,
    area: String,
    address: String,
    pincode:String,
    aadhar_no: String,
    aadhar_card: String,
    abha_no: String,
    abha_card: String,
    uhid:{
        type: String,
        default: null
    },
    relativePrifix: String,
    relative_name: String,
    relative_mobile: String,
    relation: String,
    patientPhoto:String,
    patientImpression: String,
    is_provisional:{
        type:Boolean,
        default:false
    },
    delete: {
        type: Boolean,
        default: false,
      },
    deletedAt: {
        type: Date,
    },
    }, {
      timestamps: true,
      versionKey: false,
    });
    
const patientDetailsModel = mongoose.model('patientDetails', patientDetailsSchema);
module.exports = patientDetailsModel;