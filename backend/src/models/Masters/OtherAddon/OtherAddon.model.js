const mongoose = require("mongoose");

const otherAddonSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    otherAddon: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const otherAddonModel = mongoose.model("otherAddon", otherAddonSchema);
module.exports = otherAddonModel;
