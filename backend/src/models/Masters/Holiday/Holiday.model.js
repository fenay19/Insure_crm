const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    holidayTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "holidayType",
      required: true,
    },
    holidayName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const holidayModel = mongoose.model("holiday", holidaySchema);
module.exports = holidayModel;
