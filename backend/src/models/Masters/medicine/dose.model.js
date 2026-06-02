const mongoose = require('mongoose')

const DoseSchema = new mongoose.Schema(
  {
    dose: {
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
);

const DoseModel = mongoose.model('doseMaster', DoseSchema);

module.exports = DoseModel
