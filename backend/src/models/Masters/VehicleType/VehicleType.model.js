const mongoose = require("mongoose");

const vehicleTypeSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const vehicleTypeModel = mongoose.model("vehicleType", vehicleTypeSchema);
module.exports = vehicleTypeModel;
