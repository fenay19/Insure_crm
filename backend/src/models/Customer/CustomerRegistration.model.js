const mongoose = require("mongoose");

const ContactPersonSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  department: { type: String, trim: true },
  position: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
});

const customerRegistrationSchema = new mongoose.Schema(
  {
    customerType: { type: String, trim: true },
    customerId: { type: String, trim: true },
    prefix: { type: String, trim: true },
    name: { type: String, trim: true },
    customerGroupName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customerGroup",
    },
    dob: { type: Date },
    doj: { type: Date },
    email: { type: String, trim: true, lowercase: true },
    mobile: { type: String, trim: true },
    panNo: { type: String, trim: true, uppercase: true },
    aadharNo: { type: String, trim: true },
    drivingLicenseNo: { type: String, trim: true },
    gstNo: { type: String, trim: true, uppercase: true },
    address: { type: String, trim: true },
    pincode: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    createdBy: mongoose.Types.ObjectId,
    contactPersons: [ContactPersonSchema],
  },
  { timestamps: true }
);

const CustomerRegistrationModel = mongoose.model(
  "customerRegistration",
  customerRegistrationSchema
);

module.exports = CustomerRegistrationModel;

// module.exports = mongoose.model('CustomerRegistration', customerRegistrationSchema);
