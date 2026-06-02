const mongoose = require('mongoose')

// Schema for basic details
const basicDetailsSchema = new mongoose.Schema({
  empCode: { type: String },
  prefix: { type: mongoose.Types.ObjectId, ref: 'Prefix' },
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
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

  minimumQualification: { type: String },
  diploma: { type: [String] },
  graduation: { type: [String] },
  postGraduation: { type: [String] },
  otherQualification: { type: String }
})

// Schema for past employment details
const pastEmploymentDetailsSchema = new mongoose.Schema({
  organisationName: { type: String, required: true },
  designation: { type: String, required: true },
  empCode: { type: String },
  joiningDate: { type: Date },
  relievingDate: { type: Date },
  inHandSalary: { type: String },
  yearsOfExperience: { type: String },
  note: { type: String }
})

// Schema for bank details
const HRFinanceSchema = new mongoose.Schema({
  nameOnBankAccount: { type: String },
  bankAccountNumber: { type: String },
  bankName: { type: String },
  branchName: { type: String },
  ifscCode: { type: String },
  panCardNo: { type: String },
  cancelCheck: { type: String }
})

// Schema for employment details
const employmentDetailsSchema = new mongoose.Schema({
  departmentOrSpeciality: {
    type: mongoose.Types.ObjectId,
    ref: 'DepartmentSetup'
  },

  empRole: {
    type: mongoose.Types.ObjectId,
    ref: 'EmployeeRole'
  },

  designation: {
    type: mongoose.Types.ObjectId,
    ref: 'Designation'
  },

  typeOfEmployee: {
    type: String
  },

  joiningDate: { type: Date },
  location: { type: String },
  appointmentDate: { type: Date },
  reportTo: { type: mongoose.Types.ObjectId, ref : 'Support'},
  description: { type: String }
})

const supportSchema = new mongoose.Schema(
  {
    basicDetails: basicDetailsSchema,
    pastEmploymentDetails: [pastEmploymentDetailsSchema],
    employmentDetails: employmentDetailsSchema,
    documentation: { type: Map, of: String },
    hrFinance: HRFinanceSchema,
    delete: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
)

//model

const Support = mongoose.model('Support', supportSchema)

module.exports = Support
