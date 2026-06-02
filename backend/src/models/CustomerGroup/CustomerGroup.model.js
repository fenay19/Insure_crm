const mongoose = require("mongoose");

const ContactPersonSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  department: { type: String, trim: true },
  address: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
});

const customerGroupSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    customerGroupId: {
      type: String,
      trim: true,
    },
    customerGroupName: {
      type: String,
      required: true,
    },
    subCustomerGroupName: {
      type: String,
    },
    prefix: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prefix",
    },
    customerName: {
      type: String,
      lowercase: true,
    },
    incarporatoionDate: {
      type: Date,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
    },
    gstNo: {
      type: String,
      uppercase: true,
    },
    panNo: {
      type: String,
      uppercase: true,
    },
    adhaarNo: {
      type: String,
    },
    DLNo: {
      type: String,
    },
    address: {
      type: String,
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
    createdBy: mongoose.Types.ObjectId,
    contactPerson: [ContactPersonSchema], // array of contact persons
  },
  { timestamps: true }
); // Optional: adds createdAt, updatedAt

const customerGroupModel = mongoose.model("customerGroup", customerGroupSchema);

module.exports = customerGroupModel;
