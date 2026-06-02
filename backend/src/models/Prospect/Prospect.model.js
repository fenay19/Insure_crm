const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    designation: { type: String },
    dept: { type: String },
    phone: { type: String },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: "contact" }, // <-- Add this line
  },
  { _id: true }
); // disables auto _id generation for subdocs, it wont create ID for contact so "_id : false"

const prospectSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    notes: { type: String },
    companyName: { type: String, required: true },
    phoneNo: { type: String },
    dateOfIncorporation: { type: Date },
    network: { type: String },
    address: { type: String },
    pincode: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    dob: { type: Date },
    contacts: [contactSchema], // array of contact subdocuments
  },
  {
    timestamps: true,
  }
);

const prospectModel = mongoose.model("prospect", prospectSchema);
module.exports = prospectModel;
