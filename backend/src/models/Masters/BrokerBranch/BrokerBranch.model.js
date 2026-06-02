const mongoose = require("mongoose");

const BrokerBranchSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    branchId: {
      type: String,
    },
    branchCode: {
      type: String,
      required: true,
    },
    branchName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    pinCode: {
      type: String,
    },
    mobile: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const BrokerBranchModel = mongoose.model("BrokerBranch", BrokerBranchSchema);

module.exports = BrokerBranchModel;
