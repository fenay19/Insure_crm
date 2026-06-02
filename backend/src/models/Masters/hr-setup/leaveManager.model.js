const mongoose = require("mongoose");

const LeaveManagerSchema = new mongoose.Schema(
  {
    staffName: {
      type: String,
      required: true,
    },
    leaveType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "leaveType",
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Approved", "Rejected"],
      default: "Applied",
      required: true,
    },
    leaveMode: {
      type: String,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
    },
    alternateMobileNo: {
      type: Number,
      trim: true,
    },
    noOfDays: {
      type: Number,
      trim: true,
    },
    reason: {
      type: String,
    },
    rejectReason: {
      type: String, // new field for rejection reason
      default: "",
    },
    delete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const LeaveManagerModel = mongoose.model("LeaveManager", LeaveManagerSchema);
module.exports = LeaveManagerModel;
