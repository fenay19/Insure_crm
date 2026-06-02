const mongoose = require('mongoose');

const bedMasterSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref: 'Admin'
    },
    bedNo: {
        type: Number,
        required: true,
    },
    roomName: {
        type: String,
        required: false,
    },
    roomNameId: {
        type: mongoose.Types.ObjectId,
        ref: 'room_no',
    }, 
    totalBeds:[] ,  
    delete:{
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

const BedMasterModel = mongoose.model('Bed_master', bedMasterSchema);
module.exports = BedMasterModel