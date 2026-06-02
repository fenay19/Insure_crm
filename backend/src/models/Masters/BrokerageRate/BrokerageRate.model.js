const mongoose = require("mongoose");

const brokerageRateSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    brokerageRate: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const brokerageRateModel = mongoose.model("brokerageRate", brokerageRateSchema);
module.exports = brokerageRateModel;
