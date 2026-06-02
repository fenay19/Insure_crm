const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    companyName: { type: String },
    name: { type: String, required: true },
    email: { type: String },
    designation: { type: String },
    phone: { type: String },
    department: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const contactModel = mongoose.model("contact", contactSchema);
module.exports = contactModel;
