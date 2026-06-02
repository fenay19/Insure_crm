const mongoose = require("mongoose");

const EmrPatientSchema = new mongoose.Schema({
  formType: { type: String, required: true },
  patientId: {
    type: mongoose.Types.ObjectId,
    ref: "Patient_Appointment",
    default: null,
  },
  uhid: { type: String, required: true },
  uhidId: {
    type: mongoose.Types.ObjectId,
    ref: "UHID",
  },
  emr_regNo: { type: String },
  prefix: { type: String, default: "" },
  prefixId: {
    type: mongoose.Types.ObjectId,
    ref: "prefix",
    required: false,
    default: null,
  },
  patientFirstName: { type: String, required: true },
  patientMiddleName: { type: String, required: true },
  patientLastName: { type: String, required: true },
  dob: { type: Date, default: null },
  age: { type: String, default: "" },
  mobile_no: { type: Number, default: "" },
  country: { type: String, default: "" },
  state: { type: String, default: "" },
  city: { type: String, default: "" },
  gender: { type: String, default: "" },
  address: { type: String, default: "" },
  pincode: { type: Number, default: "" },
  birthTime: { type: String, default: "" },
  martialStatus: { type: String, default: "" },
  aadhar_no: { type: Number, default: "" },
  aadhar_card: { type: String, default: "" },
  abha_no: { type: String, default: "" },
  abha_card: { type: String, default: "" },
  patientPhoto: { type: String, default: "" },
  patientImpression: { type: String, default: "" },
  departmentName: { type: String, default: "" },
  departmentId: {
    type: mongoose.Types.ObjectId,
    ref: "DepartmentSetup",
  },
  consultantName: { type: String, default: "" },
  consultantId: {
    type: mongoose.Types.ObjectId,
    ref: "Consultant",
  },
  bedAllocation: { type: String, default: "" },
  patientPayee: { type: String, default: "" },
  // patientPayeeId: {
  //   type: mongoose.Types.ObjectId,
  //   ref: "Patient_Payee",
  // },
  payeeCategory: { type: String, default: "" },
  payeeCategoryId: {
    type: mongoose.Types.ObjectId,
    ref: "Parent_Group",
  },

  arrivalMode: { type: String, default: "" },
  ambulatory: { type: String, default: "" },
  nonAmbulatory: { type: String, default: "" },
  emergencyType: { type: String, default: "" },
  medicoLegalCase: { type: String, default: "" },
  arrivalStatus: { type: String, default: "" },
  broughtBy: { type: String, default: "" },

  contactPersonprefix: { type: String, default: "" },
  contactPersonName: { type: String, default: "" },
  contactPersonMobile: { type: Number, default: "" },
  contactPersonAddress: { type: String, default: "" },
  contactPersonrelation: { type: String, default: "" },
  referByForEmergency: [],

  status: {
    type: String,
    enum: ["pending", "out"],
    default: "pending",
  },

  billingStatus: {
    type: String,
    enum: ["Non_Paid", "Paid", "Partially_Paid"],
    default: "Non_Paid",
  },
  whoBookId: {
    type: mongoose.Types.ObjectId,
    ref: "Admin",
  },
  whoBookName: {
    type: String,
  },
  patientIn: {
    type: Boolean,
    default: false,
  },
  tpa: { type: String, default: "" },
  tpaId: {
    type: mongoose.Types.ObjectId,
    ref: "TPA_Company_Master",
    default: null,
    required: false,
  },
  note: { type: [String], default: "" },
  dateOfAdmission: {
    type: Date,
    default: "",
  },
  admissionTime: {
    type: String,
    default: "",
  },
  cardNo: {
    type: String,
    trim: true,
  },
  beneficiaryId: {
    type: String,
    trim: true,
  },
  beneficiaryName: {
    type: String,
    trim: true,
  },
  validity: {
    type: Date,
  },
  sumAssured: {
    type: Number,
  },
  cardAttachment: {
    type: String,
  },
  policyNo: {
    type: String,
    trim: true,
  },
  policyType: {
    type: String,
    trim: true,
  },
  schemeName: {
    type: String,
    trim: true,
  },
  abhaNumber: {
    type: String,
    trim: true,
  },
  employeeId: {
    type: String,
    trim: true,
  },
  charityIndigent: {
    type: String,
    trim: true,
  },
  charityWeaker: {
    type: String,
    trim: true,
  },
  charityCamp: {
    type: String,
    trim: true,
  },
  delete: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Emr_patient", EmrPatientSchema);
