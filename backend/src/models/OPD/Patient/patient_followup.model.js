const mongoose = require('mongoose')

const patientFollowUpSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Types.ObjectId,
      ref: 'Patient_Appointment'
    },

    opdPatientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OPD_patient'
    },
    departmentId: {
      type: mongoose.Types.ObjectId,
      ref: 'DepartmentSetup'
    },
    consultantId: {
      type: mongoose.Types.ObjectId,
      ref: 'Consultant'
    },
    followUp: {
      type: String,
      required: false
    },
    followUpTime: {
      type: String,
      required: false
    },
    advice: {
      type: String,
      required: false,
      default: null
    },
    delete: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const PatientFollowUpModel = mongoose.model(
  'Patient_Follow_Up',
  patientFollowUpSchema
)

module.exports = PatientFollowUpModel
