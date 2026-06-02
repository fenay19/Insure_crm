const mongoose = require('mongoose')

const DearnessAllowanceSchema = new mongoose.Schema(
  {
    DA: {
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

const DearnessMasterModel = mongoose.model(
  'DearnessAllowance',
  DearnessAllowanceSchema
)
module.exports = DearnessMasterModel
