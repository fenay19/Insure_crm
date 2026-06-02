const mongoose = require("mongoose");

const TicketManageSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    TicketNo: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      lowercase: true,
    },
    product: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    installDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    urgency: {
      type: String,
      required: true,
    },
    AssignTo: { type: mongoose.Schema.Types.ObjectId, ref: "Administrative" },
    createdBy: { type: String },
    status: {
      type: String,
    },
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
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TicketManage", TicketManageSchema);
