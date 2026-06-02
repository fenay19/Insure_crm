const mongoose = require("mongoose");

const patientAppointmentSchema = new mongoose.Schema(
  {
    prefix: { type: String, required: true },
    prefixId: {
      type: mongoose.Types.ObjectId,
      ref: "Prefix",
    },
    patientFirstName: { type: String, required: true },
    patientMiddleName: { type: String, required: true },
    patientLastName: { type: String, required: true },
    age: { type: Number, required: true, min: 0 },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    contact: {
      type: String,
      validate: {
        validator: (v) => /^[0-9]{10}$/.test(v),
        message: (props) => `${props.value} is not a valid contact number!`,
      },
    },
    address: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    pincode: {
      type: String,
      validate: {
        validator: (v) => /^[1-9][0-9]{5}$/.test(v),
        message: (props) => `${props.value} is not a valid pincode!`,
      },
    },
    departmentName: { type: String },
    departmentId: { type: mongoose.Types.ObjectId, ref: "DepartmentSetup" },
    consultantName: { type: String },
    consultantId: {
      type: mongoose.Types.ObjectId,
      ref: "Consultant",
    },
    time: { type: String, required: true },
    date: { type: String, required: true },
    consultationType: {
      type: String,
    },
    appointmentMode: {
      type: String,
    },
    isConfirm: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Patient_Appointment",
  patientAppointmentSchema
);
