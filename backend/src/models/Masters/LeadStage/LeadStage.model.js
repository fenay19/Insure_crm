const mongoose = require("mongoose");

const leadStageSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    LeadStage: { type: String, required: true },
    shortForm: { type: String, required: true },
    colorCode: { type: String, required: true },
  },
  { timestamps: true }
); // timestamps adds createdAt and updatedAt fields

const leadStageModel = mongoose.model("LeadStage", leadStageSchema);

module.exports = { leadStageModel };
