const mongoose = require("mongoose");

const brokerNameSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    brokerName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const brokerNameModel = mongoose.model("brokerName", brokerNameSchema);
module.exports = brokerNameModel;
