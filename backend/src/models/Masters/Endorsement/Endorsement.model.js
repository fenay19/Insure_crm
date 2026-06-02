const mongoose = require("mongoose");

const endorsementSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    endorsement: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const endorsementModel = mongoose.model("endorsement", endorsementSchema);
module.exports = endorsementModel;
