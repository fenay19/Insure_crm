const mongoose = require("mongoose");

const networkSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    networkName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const NetworkModel = mongoose.model("network", networkSchema);
module.exports = NetworkModel;
