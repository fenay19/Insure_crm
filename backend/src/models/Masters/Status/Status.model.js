const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    statusName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const statusModel = mongoose.model("status", statusSchema);
module.exports = statusModel;
