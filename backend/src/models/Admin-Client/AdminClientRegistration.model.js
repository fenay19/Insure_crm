const mongoose = require("mongoose");

const ContactPersonSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  department: { type: String, trim: true },
  position: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
});

const LocationSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  address: { type: String, trim: true },
  pincode: { type: String, trim: true },
  country: { type: String, trim: true },
  state: { type: String, trim: true },
  city: { type: String, trim: true },
  gstNo: { type: String, trim: true, uppercase: true },
});

const AdminclientRegistrationSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    officialPhoneNo: {
      type: String,
      required: true,
      trim: true,
    },
    altPhoneNo: {
      type: String,
      trim: true,
    },
    officialMailId: {
      type: String,
      trim: true,
      lowercase: true,
    },
    altMailId: {
      type: String,
      trim: true,
      lowercase: true,
    },
    emergencyContactPerson: {
      type: String,
      trim: true,
    },
    emergencyContactNo: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    gstNo: {
      type: String,
      trim: true,
      uppercase: true,
    },
    panNo: {
      type: String,
      trim: true,
      uppercase: true,
    },
    logo: {
      type: String,
      default: null,
    },
    officeAddress: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      trim: true,
    },
    endDate: {
      type: Date,
      trim: true,
    },
    createdBy: mongoose.Types.ObjectId,
    contactPerson: [ContactPersonSchema], // array of contact persons
    locations: {
      exportCenter: [LocationSchema], // ✅ now arrays
      factories: [LocationSchema],
      warehouse: [LocationSchema],
      branches: [LocationSchema],
    },
  },
  { timestamps: true }
); // Optional: adds createdAt, updatedAt

const AdminClientRegistrationModel = mongoose.model(
  "AdminclientRegistration",
  AdminclientRegistrationSchema
);

module.exports = AdminClientRegistrationModel;
