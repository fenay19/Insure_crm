const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  section: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Section', sectionSchema);
