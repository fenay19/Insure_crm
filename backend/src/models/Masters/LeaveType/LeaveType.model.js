const mongoose = require("mongoose");

const leaveTypeSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    leaveType: { type: String, required: true },
    shortForm: { type: String, required: true },
    totalLeaves: { type: String, required: true },
    leavesPerMonth: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const leaveTypeModel = mongoose.model("leaveType", leaveTypeSchema);
module.exports = leaveTypeModel;
