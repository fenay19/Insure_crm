const mongoose = require('mongoose')

const HRAAllowanceSchema = new mongoose.Schema(
  {
    HRA: {
      type: Number,
      trim: true
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

const HRAAllowanceMasterModel = mongoose.model('HRAAllowance', HRAAllowanceSchema)
module.exports = HRAAllowanceMasterModel
