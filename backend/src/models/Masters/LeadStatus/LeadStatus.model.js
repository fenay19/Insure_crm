const mongoose = require("mongoose");

const leadStatusSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    LeadStatus: { type: String, required: true },
    shortForm: { type: String, required: true },
    colorCode: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const leadStatusModel = mongoose.model("leadStatus", leadStatusSchema);
module.exports = leadStatusModel;
