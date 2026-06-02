const mongoose = require("mongoose");

// Followup Schema
const followupSchema = new mongoose.Schema(
  {
    followupDate: { type: String, required: true },
    followupTime: { type: String },
    comment: { type: String },
    leadstatus: { type: String },
  },
  { _id: true, timestamps: true }
);

// Contact Schema
const contactSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    designation: { type: String },
    department: { type: String },
    phone: { type: String },
    selected: { type: Boolean },
  },
  { _id: true, timestamps: true }
);

// Main Lead Schema
const leadSchema = new mongoose.Schema(
  {
    // References (use ObjectId and ref for population)
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    Prospect: { type: mongoose.Schema.Types.ObjectId, ref: "prospect" },
    Client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminclientRegistration",
    },
    newCompanyName: { type: String, default: "" },
    companyName: { type: String, default: "" },
    reference: { type: mongoose.Schema.Types.ObjectId, ref: "leadReference" },
    productService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubProductCategory",
    },
    leadstatus: { type: mongoose.Schema.Types.ObjectId, ref: "leadStatus" },
    leadType: { type: mongoose.Schema.Types.ObjectId, ref: "leadType" },
    assignTo: { type: mongoose.Schema.Types.ObjectId, ref: "Administrative" },

    // Main fields
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    countryCode: { type: String },
    phoneNo: { type: String, required: true },
    altPhoneNo: { type: String },
    email: { type: String },
    altEmail: { type: String },
    notes: { type: String },
    address: { type: String },
    pincode: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    projectValue: { type: String },
    contact: [contactSchema],
    followups: [followupSchema],
    leadCategory: { type: String },
    status: {
      type: String,
      enum: ["Active", "LS", "LW"], // LS = Lead Suspended, LW = Lead Warning (for example)
      default: "Active",
    },
  },
  { timestamps: true }
);

const leadModel = mongoose.model("lead", leadSchema);
module.exports = leadModel;
