const mongoose = require("mongoose");
const crossConsultationSchema = mongoose.Schema(
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
    consultant: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Consultant",
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

const PatientCrossConsultationModel = mongoose.model(
  "PatientCrossConsultationModel",
  crossConsultationSchema
);

module.exports = PatientCrossConsultationModel;
