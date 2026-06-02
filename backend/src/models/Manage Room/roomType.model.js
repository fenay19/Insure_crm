const mongoose = require('mongoose');

const roomTypeSchema = new mongoose.Schema({
  user:{
    type:mongoose.Types.ObjectId,
    ref: 'Admin'
  },
  roomType: {
    type: String,
    required: true,
  },
  categoryName:{
    type: String,
    required: true,
  },
  categoryNameId:{
    type: mongoose.Types.ObjectId,
    ref: 'category_master',
  },
  ledger:{ type:String,required: false },
  ledgerId:{type: mongoose.Types.ObjectId, ref:'Ledger'},
  subLedger: { type: String },
  subLedgerId:{ type: mongoose.Types.ObjectId, ref:'Sub_Ledger'},
  serviceGroup: { type: String, },
  service:{ type: String},
  floorNumber: { type: String, required: false},
  description: {
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

const RoomTypeModel = mongoose.model('RoomType', roomTypeSchema);
module.exports = RoomTypeModel