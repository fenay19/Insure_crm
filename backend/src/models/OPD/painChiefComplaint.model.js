const mongoose = require("mongoose");

const painDetailsSchema = new mongoose.Schema(
  {
    chiefComplaint: { type: String, required: false },
    location: [{ data: { type: String, required: false } }],
    duration: [{ data: { type: String, required: false } }],
    natureOfPain: [{ data: { type: String, required: false } }],
    aggravatingFactors: [{ data: { type: String, required: false } }],
    relievingFactors: [{ data: { type: String, required: false } }],
    quality: [{ data: { type: String, required: false } }],
    painScore: { type: Number, required: false },
    painType: { type: String, required: false },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepartmentSetup",
      required: false,
    },
    delete: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const PainChiefComplaint = mongoose.model(
  "PainChiefComplaint",
  painDetailsSchema
);

module.exports = PainChiefComplaint;
