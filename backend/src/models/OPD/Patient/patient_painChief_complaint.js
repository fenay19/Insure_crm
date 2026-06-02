const mongoose = require("mongoose");

const PainChiefComplaintSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Types.ObjectId,
      ref: "Patient_Appointment",
    },
    opdPatientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OPD_patient",
    },
    departmentId: {
      type: mongoose.Types.ObjectId,
      ref: "DepartmentSetup",
    },
    consultantId: {
      type: mongoose.Types.ObjectId,
      ref: "Consultant",
    },
    chiefComplaint: {
      type: Array,
      notes: {
        type: String,
        default: "",
      },
      duration: {
        type: [String],
        default: [],
      },
      natureOfPain: {
        type: [String],
        default: [],
      },
      location: {
        type: [String],
        default: [],
      },
      aggravatingFactors: {
        type: [String],
        default: [],
      },
      relievingFactors: {
        type: [String],
        default: [],
      },
      quality: {
        type: [String],
        default: [],
      },
      painType: {
        type: [String],
        default: [],
      },
      chiefComplaint: {
        type: String,
      },
      painScore: {
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

const PatientPainChiefComplentModel = mongoose.model(
  "Patient_pain_Chief_Complaint",
  PainChiefComplaintSchema
);

module.exports = PatientPainChiefComplentModel;
