const mongoose = require("mongoose");

const fuelTypeSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    fuelType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const fuelTypeModel = mongoose.model("fuelType", fuelTypeSchema);
module.exports = fuelTypeModel;
