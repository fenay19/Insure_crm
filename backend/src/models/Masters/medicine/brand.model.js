const mongoose = require('mongoose')

const BrandNameSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      required: false
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

const BrandNameModel = mongoose.model('brandMaster', BrandNameSchema);

module.exports = BrandNameModel
