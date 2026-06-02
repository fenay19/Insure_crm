const mongoose = require("mongoose");

const leadTypeSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    LeadType: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const leadTypeModel = mongoose.model("leadType", leadTypeSchema);
module.exports = leadTypeModel;
