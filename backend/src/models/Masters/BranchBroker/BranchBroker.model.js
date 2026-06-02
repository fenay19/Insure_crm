const mongoose = require("mongoose");

const branchBrokerSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    branchBroker: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const branchBrokerModel = mongoose.model("branchBroker", branchBrokerSchema);
module.exports = branchBrokerModel;
