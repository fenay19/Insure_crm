// models/TemplateSheet.js
const mongoose = require('mongoose');

const AdminRecordSchema = new mongoose.Schema({
  time: String,
  sign: String,
  showCurrentTime: Boolean,
});

const DrugDataSchema = new mongoose.Schema({
  diagnosis: String,
  allergy: String,
  postofDay: String,
  icuDay: String,
  dietOrders: String,
  name: String, // (You can change this to genericName if needed)
  day: String,
  dose: String,
  route: String,
  freq: String,
  adminRecords: [AdminRecordSchema],
});

const TemplateSheetSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: false }, // optional if you want to link
  customSections: [String],
  drugData: [DrugDataSchema],
}, { timestamps: true });

module.exports = mongoose.model('TemplateSheet', TemplateSheetSchema);
