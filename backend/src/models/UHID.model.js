const mongoose = require('mongoose');

const UHIDSchema = new mongoose.Schema(
  {
    uhid: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'UHIDMaster' } 
);

const UHID = mongoose.model('UHID', UHIDSchema);

module.exports = UHID; 
