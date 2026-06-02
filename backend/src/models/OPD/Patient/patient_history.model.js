const mongoose = require("mongoose");

const patientHistorySchema = new mongoose.Schema(
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
    medicalProblems: {
      type: Array,
      required: false,
      default: null,
    },
    drugHistory: {
      type: Array,
      required: false,
      default: null,
    },
    allergies: {
      having: {
        type: String,
      },
      which: {
        food: {
          type: Array,
          default: null,
        },
        general: {
          type: Array,
          default: null,
        },
        drug: {
          type: Array,
          default: null,
        },
        other: {
          type: String,
          required: false,
        },
      },
    },
    familyHistory: {
      type: Array,
      default: null,
    },
    lifeStyle: {
      type: Array,
      default: null,
    },
    gynac: {
      type: Array,
      default: null,
    },
    obstetric: {
      type: Array,
      default: null,
    },
    nutritional: {
      type: Array,
      default: null,
    },
    pediatric: {
      type: Array,
      default: null,
    },
    procedure: {
      having: {
        type: String,
        required: false,
      },
      which: {
        type: Array,
        default: null,
      },
    },
    other: {
      type: Array,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const PatientHistroyModel = mongoose.model(
  "Patient_History",
  patientHistorySchema
);

module.exports = PatientHistroyModel;
