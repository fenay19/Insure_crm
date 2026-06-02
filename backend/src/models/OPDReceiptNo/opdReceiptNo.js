const mongoose = require('mongoose')

const opdReceiptNoSchema = new mongoose.Schema(
  {
    receiptNo: {
      type: String,
      require: true
    }
  },
  {
    timestamps: true
  }
)

const OPDReceiptNoModel = mongoose.model('OPDReceiptNo', opdReceiptNoSchema)
module.exports = OPDReceiptNoModel
