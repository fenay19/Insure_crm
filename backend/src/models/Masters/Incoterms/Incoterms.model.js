const mongoose = require("mongoose");

const incotermsSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    incoterms: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const incotermsModel = mongoose.model("incoterms", incotermsSchema);
module.exports = incotermsModel;
