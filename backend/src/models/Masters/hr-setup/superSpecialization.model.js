const mongoose = require('mongoose')

const SuperSpecializationSchema = new mongoose.Schema(
  {
    superSpecialization: {
      type: String
    },

    delete: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const SuperSpecializationMasterModel = mongoose.model(
  'SuperSpecializationMaster',
  SuperSpecializationSchema
)

module.exports = SuperSpecializationMasterModel
