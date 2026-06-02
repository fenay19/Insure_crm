const mongoose = require("mongoose");

const licenseValiditySchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    licenseName: {
      type: String,
      required: true,
      maxlength: 100,
    },
    brokerName: {
      type: String,
    },
    licenseNumber: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
    },
    createdBy: mongoose.Types.ObjectId,
  },
  { timestamps: true }
); // Optional: adds createdAt, updatedAt

const licenseValidityModel = mongoose.model(
  "licenseValidity",
  licenseValiditySchema
);

module.exports = licenseValidityModel;
