// models/Attendance.js
const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Administrative", // reference to your staff collection
    required: true,
  },
  status: {
    type: String,
    enum: ["PRESENT", "ABSENT", "HALF DAY"],
    default: "PRESENT",
  },
  inTime: {
    type: String, // e.g. "09:30"
    default: "",
  },
  outTime: {
    type: String, // e.g. "18:00"
    default: "",
  },
  comment: {
    type: String,
    default: "",
  },
});

const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: String, // e.g. "2025-10-27"
      required: true,
    },
    records: [attendanceRecordSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // optional, for tracking who marked attendance
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
