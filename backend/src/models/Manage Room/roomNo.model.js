const mongoose = require('mongoose');

const RoomNoMasterSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref: 'Admin'
    },
    roomType:{
        type: String,
        required: true,
    },
    roomTypeId: {
        type: mongoose.Types.ObjectId,
        ref: 'RoomType',
        required: true,
    },
    roomNo: {
        type: String,
        required: true,
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

const RoomNoMasterModel = mongoose.model('room_no', RoomNoMasterSchema);
module.exports = RoomNoMasterModel