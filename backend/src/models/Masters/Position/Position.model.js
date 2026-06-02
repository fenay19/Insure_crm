const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    position: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const positionModel = mongoose.model("position", positionSchema);

module.exports = positionModel;
