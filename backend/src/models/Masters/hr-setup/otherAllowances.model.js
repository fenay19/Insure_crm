const mongoose = require('mongoose')

const OtherAllowancesSchema = new mongoose.Schema(
  {
    OtherAllowances: {
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
const OtherAllowancesModel = mongoose.model(
  'OtherAllowances',
  OtherAllowancesSchema
)
module.exports = OtherAllowancesModel
