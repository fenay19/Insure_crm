const mongoose = require("mongoose");

const TaskManagementSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    title: { type: String, required: true },
    priority: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Priority",
      required: true,
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "taskStatus",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminclientRegistration",
      required: true,
    },
    employeeName: { type: String, required: true },
    assignedTo: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Administrative" },
    ],
    description: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    createdBy: { type: String },
    statusHistory: [
      {
        fromStatus: String,
        toStatus: String,
        comment: String,
        user: String,
        timestamp: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaskManagement", TaskManagementSchema);
