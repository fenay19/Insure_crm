const mongoose = require('mongoose')

const ListOfCouncilSchema = new mongoose.Schema(
  {
    council: {
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

const ListOfCouncilMasterModel = mongoose.model(
  'ListOfCouncilMaster',
  ListOfCouncilSchema
)
module.exports = ListOfCouncilMasterModel
