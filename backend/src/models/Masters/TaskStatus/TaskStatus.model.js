const mongoose = require("mongoose");

const taskStatusSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    TaskStatus: { type: String, required: true },
    shortForm: { type: String, required: true },
    colorCode: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const taskStatusModel = mongoose.model("taskStatus", taskStatusSchema);
module.exports = taskStatusModel;
