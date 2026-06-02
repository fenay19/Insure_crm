const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient_Appointment",
      required: false,
    },
    personWhoSendNotification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultant",
      required: false,
    },
    consultantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultant",
      required: false,
    },
    opdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OPD_patient",
      required: false,
    },
    message: {
      type: String,
      required: false,
    },
    pendingAmount: {
      type: Number,
      default: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // optional, if you want to track the creator (like receptionist, doctor)
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
