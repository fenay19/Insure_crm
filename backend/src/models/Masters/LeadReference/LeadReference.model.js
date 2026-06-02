const mongoose = require("mongoose");

const leadReferenceSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    LeadReference: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const leadReferenceModel = mongoose.model("leadReference", leadReferenceSchema);
module.exports = leadReferenceModel;
