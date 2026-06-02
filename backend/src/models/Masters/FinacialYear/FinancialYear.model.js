const mongoose = require("mongoose");

const financialYearSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const financialYearModel = mongoose.model("financialYear", financialYearSchema);
module.exports = financialYearModel;
