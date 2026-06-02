const mongoose = require('mongoose')

const DiplomaSchema = new mongoose.Schema(
  {
    diploma: {
      type: String,
      require: true
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

const DiplomaMasterModel = mongoose.model('DiplomaMaster', DiplomaSchema)
module.exports = DiplomaMasterModel