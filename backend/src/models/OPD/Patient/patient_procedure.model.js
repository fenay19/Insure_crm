const mongoose = require("mongoose");

const PatientProcedureSchema = new mongoose.Schema(
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
    procedure: {
      type: Array,
      procedureName: {
        type: String,
      },
    },
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

const PatientProcedureModel = mongoose.model(
  "Patient_Procedure",
  PatientProcedureSchema
);

module.exports = PatientProcedureModel;
