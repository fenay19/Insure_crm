const mongoose = require("mongoose");

const BankDetailsSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    branchName: {
      type: String,
      required: true,
    },
    IFSCcode: {
      type: String,
      required: true,
    },
    PanNo: {
      type: String,
      required: true,
    },
    UpiId: {
      type: String,
      required: true,
    },
    QRCode: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const BankDetailsModel = mongoose.model("BankDetails", BankDetailsSchema);

module.exports = BankDetailsModel;
