const mongoose = require('mongoose')

const TypeOfLeaveSchema = new mongoose.Schema(
  {
    typeOfLeave: {
      type: String,
      required: true,
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

const TypeOfLeaveMasterModel = mongoose.model(
  'TypeOfLeaveMaster',
  TypeOfLeaveSchema
)

module.exports = TypeOfLeaveMasterModel
