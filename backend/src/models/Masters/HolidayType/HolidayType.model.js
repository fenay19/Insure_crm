const mongoose = require("mongoose");

const holidayTypeSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    holidayTypeName: {
      type: String,
      required: true,
    },
    color: {
      type: String, // e.g., "#ff0000" or "red"
      default: "#1976d2",
    },
  },
  {
    timestamps: true,
  }
);

const holidayTypeModel = mongoose.model("holidayType", holidayTypeSchema);
module.exports = holidayTypeModel;
