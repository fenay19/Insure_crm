const mongoose = require("mongoose");

const PatientChiefComplaintSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Types.ObjectId,
      ref: "Patient_Appointment",
    },

    opdPatientId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'OPD_patient'
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
      chiefComplaint: {
        type: String,
      },
      descreption: {
        type: String,
      },
      notes: {
        type: String,
      },
      since: {
        type: String,
      },
      symptoms: {
        type: Array,
        with: {
          type: String,
        },
      },
      treatment: {
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

const PatientChiefComplaintModel = mongoose.model(
  "Patient_Chief_Complaint",
  PatientChiefComplaintSchema
);

module.exports = PatientChiefComplaintModel;
