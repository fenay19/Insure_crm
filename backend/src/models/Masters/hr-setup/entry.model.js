const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  percentage: {
    type:String,
    required: true,
  },
  selectedItems: {
    type: [String],
    default: [],
  },
  employee: {
    type: String,
    default: '',
  },
  employer: {
    type: String,
    default: '',
  },
  delete: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Entry', EntrySchema);
