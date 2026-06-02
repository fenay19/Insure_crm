const mongoose = require("mongoose");

const patientPathologySchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Types.ObjectId,
      ref: "Patient_Appointment",
    },
    departmentId: {
      type: mongoose.Types.ObjectId,
      ref: "DepartmentSetup",
    },
    consultantId: {
      type: mongoose.Types.ObjectId,
      ref: "Consultant",
    },
    opdPatientId: {
      type: mongoose.Types.ObjectId,
      ref: "OPD_patient",
    },
    notes: String,
    pathology: {
      type: Array,
      testName: {
        type: String,
      },
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

const PatientPathologyModel = mongoose.model(
  "Patient_Pathology",
  patientPathologySchema
);

module.exports = PatientPathologyModel;
