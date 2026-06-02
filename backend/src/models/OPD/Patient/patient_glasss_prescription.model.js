const mongoose = require("mongoose");

const EyePrescriptionSchema = new mongoose.Schema({
  distance: {
    sphere: { type: String },
    cylinder: { type: String },
    axis: { type: String },
    vision: { type: String },
  },
  add: {
    sphere: { type: String },
    cylinder: { type: String },
    axis: { type: String },
    vision: { type: String },
  },
});

const PatientGlassPrescriptionSchema = new mongoose.Schema(
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
    right: [
      {
        type: EyePrescriptionSchema,
      },
    ],
    left: [
      {
        type: EyePrescriptionSchema,
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const patienRemarkSchema = new mongoose.Schema(
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
    visionRemark: {
      type: String,
      trim: true,
    },
    visionAdvice: {
      type: String,
      trim: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const PatientRemarkModel = mongoose.model("patient_remark", patienRemarkSchema);
const PatientGlassPrescriptionModel = mongoose.model(
  "Patient_Glass_Prescription",
  PatientGlassPrescriptionSchema
);

module.exports = { PatientGlassPrescriptionModel, PatientRemarkModel };
