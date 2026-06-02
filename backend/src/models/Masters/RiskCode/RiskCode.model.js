const mongoose = require("mongoose");

const riskCodeSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    riskCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const riskCodeModel = mongoose.model("riskCode", riskCodeSchema);
module.exports = riskCodeModel;
