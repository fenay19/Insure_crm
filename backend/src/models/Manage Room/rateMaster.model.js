const mongoose = require('mongoose');

const rateMasterSchema = new mongoose.Schema({
user:{
    type:mongoose.Types.ObjectId,
    ref: 'Admin'
},
roomNo: {
    type: String,
    required: true,
},
roomType: {
    type: String,
    required: false,
},
roomTypeId: {
    type: mongoose.Types.ObjectId,
    ref: 'RoomType',
},
rate:{
    type: String,
    required: false,
},
patientPayee:{
    type: String,
    required: false,
},
patientPayeeId:{
    type: mongoose.Types.ObjectId,
    ref: 'Patient_Payee',
},
parentPayee:{
    type: String,
    required: false,
},
parentPayeeId:{
    type: mongoose.Types.ObjectId,
    ref: 'Payee_Parent_Group',  
},
parentGroup:{
    type: String,
    required: false,
},
parentGroupId: {
    type: mongoose.Types.ObjectId,
    ref: 'Parent_Group',  
},   
location: {
    type: String,
    required: false,
},
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
    timestamps: true,
    versionKey: false,
});

const RateMasterModel = mongoose.model('Rate_master', rateMasterSchema);
module.exports = RateMasterModel