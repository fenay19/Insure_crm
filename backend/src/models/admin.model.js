const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    refId: {
      type: mongoose.Types.ObjectId,
    },
    refType: {
      type: String,
    },
    role: {
      type: String,
    },
    roleId: {
      type: mongoose.Types.ObjectId,
      ref: "Roles",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    resetOtp: {
      type: String,
    },
    resetOtpExpires: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const AdminModel = mongoose.model("Admin", adminSchema);

module.exports = AdminModel;
