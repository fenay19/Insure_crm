const mongoose = require("mongoose");

const PatientLabRadiologySchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Types.ObjectId,
      ref: "OPD_Patient",
    },
    departmentId: {
      type: mongoose.Types.ObjectId,
      ref: "DepartmentSetup",
    },
    consultantId: {
      type: mongoose.Types.ObjectId,
      ref: "Consultant",
    },
    labRadiology: [
      {
        investigationId: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        testName: {
          type: String,
          required: true,
        },
        selectedFor: {
          type: String,
        },
      },
    ],
    delete: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const PatientLabRadiologyModel = mongoose.model(
  "Patient_Lab_Radiology",
  PatientLabRadiologySchema
);

module.exports = PatientLabRadiologyModel;
