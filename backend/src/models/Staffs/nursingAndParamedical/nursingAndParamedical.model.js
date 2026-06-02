const mongoose = require("mongoose");

// Schema for basic details
const basicDetailsSchema = new mongoose.Schema({
  empCode: { type: String },
  prefix: { type: mongoose.Types.ObjectId, ref: "Prefix" },
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  dateOfBirth: { type: Date },
  dateOfAnniversary: { type: Date },
  adharNumber: { type: String },
  panNumber: { type: String },
  profilePhoto: { type: String },
  passPortNumber: { type: String },

  contactNumber: { type: String },
  alternateContactNumber: { type: String },
  email: { type: String },
  alternateEmail: { type: String },

  residentialAddress: { type: String },
  residentialPincode: { type: String },
  residentialCity: { type: String },
  residentialState: { type: String },
  residentialDistrict: { type: String },
  isPermanentSame: { type: Boolean },
  permanentAddress: { type: String },
  permanentPincode: { type: String },
  permanentCity: { type: String },
  permanentDistrict: { type: String },
  permanentState: { type: String },

  emergencyContactPersonName: { type: String },
  emergencyContactPersonMobileNumber: { type: String },
  emergencyAddress: { type: String },
});

// Schema for past employment details
const pastEmploymentDetailsSchema = new mongoose.Schema({
  organisationName: { type: String, required: true },
  designation: { type: String, required: true },
  empCode: { type: String },
  joiningDate: { type: Date },
  relievingDate: { type: Date },
  inHandSalary: { type: String },
  yearsOfExperience: { type: String },
  note: { type: String },
});

// Schema for bank details
const HRFinanceSchema = new mongoose.Schema({
  nameOnBankAccount: { type: String },
  bankAccountNumber: { type: String },
  bankName: { type: String },
  branchName: { type: String },
  ifscCode: { type: String },
  panCardNo: { type: String },
  cancelCheck: { type: String },
});

// Schema for employment details
const employmentDetailsSchema = new mongoose.Schema({
  departmentOrSpeciality: [
    {
      type: mongoose.Types.ObjectId,
      ref: "DepartmentSetup",
      default: null,
    },
  ],

  empRole: {
    type: mongoose.Types.ObjectId,
    ref: "EmployeeRole",
    default: null,
  },

  designation: {
    type: mongoose.Types.ObjectId,
    ref: "Designation",
    default: null,
  },

  typeOfEmployee: {
    type: String,
  },

  OPD: {
    type: [String], // Changed to array of strings
    default: [], // Ensure it defaults to an empty array if not provided
  },

  IPD: {
    type: [String], // Changed to array of strings
    default: [], // Ensure it defaults to an empty array if not provided
  },

  emergency: {
    type: [String], // Changed to array of strings
    default: [], // Ensure it defaults to an empty array if not provided
  },

  joiningDate: { type: Date },
  location: { type: String },
  appointmentDate: { type: Date },
  reportTo: {
    type: mongoose.Types.ObjectId,
    ref: "NursingAndParamedical",
    default: null,
  },
  description: { type: String },
});

const qualificationSchema = new mongoose.Schema({
  diploma: {
    type: [mongoose.Types.ObjectId],
    ref: "DiplomaMaster",
    default: [],
  },

  graduation: {
    type: [mongoose.Types.ObjectId],
    ref: "GraduationMaster",
    default: [],
  },

  postGraduation: {
    type: [mongoose.Types.ObjectId],
    ref: "PostGraduationMaster",
    default: [],
  },

  superSpecialization: {
    type: [mongoose.Types.ObjectId],
    ref: "SuperSpecializationMaster",
    default: [],
  },

  otherQualification: {
    type: String,
    default: "non",
  },
});

const additionalDetailsSchema = new mongoose.Schema({
  registrationNo: {
    type: String,
  },
  councilName: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedBy: {
    type: mongoose.Types.ObjectId, // Corrected the type here
    ref: "Administrative",
    default: null,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
});

//schema for system rights
const systemRightsSchema = new mongoose.Schema({
  authorizedIds: {
    type: Map,
    of: Boolean,
  },
  actionPermissions: {
    type: Map,
    of: new mongoose.Schema({
      Add: { type: Boolean, default: false },
      View: { type: Boolean, default: false },
      Edit: { type: Boolean, default: false },
      Delete: { type: Boolean, default: false },
    }),
  },
});

// Main schema for administrative records
const nursingAndParamedicalSchema = new mongoose.Schema(
  {
    basicDetails: basicDetailsSchema,
    pastEmploymentDetails: [pastEmploymentDetailsSchema],
    employmentDetails: employmentDetailsSchema,
    qualification: qualificationSchema,
    additionalDetails: additionalDetailsSchema,
    documentation: { type: Map, of: String },
    hrFinance: HRFinanceSchema,
    delete: { type: Boolean, default: false },
    systemRights: systemRightsSchema,
    access:{
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

// Model
const NursingAndParamedical = mongoose.model(
  "NursingAndParamedical",
  nursingAndParamedicalSchema
);

module.exports = NursingAndParamedical;
