const mongoose = require('mongoose')

const GraduationSchema = new mongoose.Schema(
  {
    graduation: {
      type: String,
      required: true
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

const GraduationMasterModel = mongoose.model(
  'GraduationMaster',
  GraduationSchema
)
module.exports = GraduationMasterModel
