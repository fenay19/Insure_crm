const mongoose = require("mongoose");

const AdmincontactPersonSchema = new mongoose.Schema({
 name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  department: {
    type: String,
    trim: true,
  },
  position: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    // match: [/^([a-zA-Z0-9_\.-]+)@([a-zA-Z0-9\.-]+)\.([a-zA-Z]{2,6})$/, 'Please enter a valid email'],
    // default: ''
  },
  phone: {
    type: String,
    trim: true,
    // match: [/^\d{10,15}$/, 'Please enter a valid phone number'],
    // default: ''
  }
}, {
  timestamps: true
});

const AdminContactPersonModel = mongoose.model("AdmincontactPerson", AdmincontactPersonSchema);
module.exports = AdminContactPersonModel;
