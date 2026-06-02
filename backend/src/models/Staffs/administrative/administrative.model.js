const mongoose = require("mongoose");

//todo: Schema for basic details  || Basic Details Form
const basicDetailsSchema = new mongoose.Schema({
  //? Personal Information
  empCode: { type: String }, // ✅
  prefix: { type: mongoose.Types.ObjectId, ref: "Prefix" }, // ✅
  firstName: { type: String }, // ✅
  middleName: { type: String }, // ✅
  lastName: { type: String }, // ✅
  gender: { type: String, enum: ["Male", "Female", "Other"] }, // ✅
  dateOfBirth: { type: Date }, // ✅
  adharNumber: { type: String }, // ✅
  // panNumber: { type: String }, // ✅
  profilePhoto: { type: String }, // ✅
  isMarried: { type: Boolean, default: false },
  spouseName: { type: String }, // ✅
  dateOfAnniversary: { type: Date }, // ✅
  //? contact Information
  contactNumber: { type: String }, // ✅
  alternateContactNumber: { type: String }, // ✅
  email: { type: String }, // ✅
  alternateEmail: { type: String }, // ✅

  //? Address Information
  residentialAddress: { type: String }, // ✅
  residentialPincode: { type: String }, // ✅
  residentialCity: { type: String }, // ✅
  residentialDistrict: { type: String }, // ✅
  residentialState: { type: String }, // ✅

  //? Permanent address is same as residential address
  isPermanentSame: { type: Boolean }, // ✅
  permanentAddress: { type: String }, // ✅
  permanentPincode: { type: String }, // ✅
  permanentCity: { type: String }, // ✅
  permanentDistrict: { type: String }, // ✅
  permanentState: { type: String }, // ✅

  //? Emergency Contact Information
  emergencyContacts: [
    {
      emergencyContactPersonName: { type: String }, // ✅
      emergencyAddress: { type: String }, // ✅
      emergencyContactPersonMobileNumber: { type: String }, // ✅
    },
  ],

  //? Bank Information
  nameOnBankAccount: { type: String }, // ✅
  bankAccountNumber: { type: String }, // ✅
  bankName: { type: String }, // ✅
  branchName: { type: String }, // ✅
  ifscCode: { type: String }, // ✅
  panCardNo: { type: String }, // ✅
});

//!==================== Basic Details Form End ========================

//todo:  Schema for past employment details  || Past Employment Details
const pastEmploymentDetailsSchema = new mongoose.Schema({
  organisationName: { type: String }, // ✅
  designation: { type: String }, // ✅
  empCode: { type: String }, // ✅
  joiningDate: { type: Date }, // ✅
  relievingDate: { type: Date }, // ✅
  inHandSalary: { type: String }, // ✅
  yearsOfExperience: { type: String }, // ✅
  note: { type: String }, // ✅
});

//!==================== Past Employment Details End ========================

//todo: Schema for employment details  or Current Employment Details Form
const employmentDetailsSchema = new mongoose.Schema({
  //! not matched || //? get data from the master department
  departmentOrSpeciality: {
    //❌ not added
    //? department
    type: mongoose.Types.ObjectId,
    ref: "DepartmentSetup", //? Department
  },

  department: {
    // ✅
    //? department
    type: mongoose.Types.ObjectId,
    ref: "department", //? Department
  },

  designation: {
    //❌ not added
    type: mongoose.Types.ObjectId,
    ref: "Designation",
  },

  position: {
    // ✅
    //? postion
    type: mongoose.Types.ObjectId,
    ref: "position", //? postion
  },

  empRole: {
    //❌ not added
    type: mongoose.Types.ObjectId,
    ref: "EmployeeRole",
  },

  typeOfEmployee: {
    // ✅
    type: String,
  },

  joiningDate: { type: Date }, // ✅
  location: { type: String }, // ✅
  description: { type: String }, // ✅
  // appointmentDate: { type: Date }, //❌ not added
  reportTo: { type: mongoose.Types.ObjectId, ref: "Administrative" }, //❌ not added
});

//todo: name and file  // Upload Documentation // ✅
const documentationSchema = new mongoose.Schema(
  {
    name: { type: String },
    file: { type: String, default: null },
  },
  { _id: false }
);

//!==================== Upload Documentation End ========================

//todo: Education Details Form
const educationSchema = new mongoose.Schema(
  {
    qualification: { type: String },
    yearOfPassing: { type: Number },
    universityOrBoard: { type: String },
  },
  { _id: false }
);
//!==================== Education Details Form End ========================

//! Schema for bank details (not in use)
// const HRFinanceSchema = new mongoose.Schema({
//   nameOnBankAccount: { type: String },
//   bankAccountNumber: { type: String },
//   bankName: { type: String },
//   branchName: { type: String },
//   ifscCode: { type: String },
//   panCardNo: { type: String },
//   cancelCheck: { type: String },
// });

//todo: schema for system rights  // System Rights Management
const systemRightsSchema = new mongoose.Schema({
  authorizedIds: {
    // ✅ //? Stores which user IDs are authorized for certain features. key=value pairs
    type: Map,
    of: Boolean,
    default: {},
  },
  actionPermissions: {
    // ✅
    type: Map,
    of: new mongoose.Schema({
      Add: { type: Boolean, default: false },
      View: { type: Boolean, default: false },
      Edit: { type: Boolean, default: false },
      Delete: { type: Boolean, default: false },
    }),
  },
});
//!==================== System Rights Management End ========================

// schema for Salary and wages
const DeductionComponentSchema = new mongoose.Schema(
  {
    employee: Number,
    employer: Number,
  },
  { _id: false }
); // Prevents _id from being added inside each deduction component

const SalaryAndWages = new mongoose.Schema({
  employeeId: String, // ✅
  name: String, // ✅
  position: String, // ✅
  incomeDetails: {
    basicSalary: Number, // ✅
    incomeComponents: {
      // ✅
      type: Map, // Dynamic income components as Map
      of: Number,
      default: {},
    },
    grossMonthlyIncome: Number, // ✅
  },
  deductionDetails: {
    // deductionComponents is a Map of { employee: Number, employer: Number }
    deductionComponents: {
      // ✅
      type: Map,
      of: DeductionComponentSchema,
      default: {},
    },
    totalEmployeeContributions: Number, // ✅
    totalEmployerContributions: Number, // ✅
  },
});

// Main schema for administrative records
const administrativeSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    basicDetails: basicDetailsSchema,
    pastEmploymentDetails: [pastEmploymentDetailsSchema],
    employmentDetails: employmentDetailsSchema,
    // documentation: { type: Map, of: String }, // Upload Documentation // ✅
    documentation: {
      type: mongoose.Schema.Types.Mixed, // Accepts object like { offerLetter: "file.pdf" }
      default: {},
    },
    // documentation: [documentationSchema],
    educationDetails: [educationSchema],
    // hrFinance: HRFinanceSchema,                //❌ not added
    systemRights: systemRightsSchema,
    salaryAndWages: SalaryAndWages,
    delete: { type: Boolean, default: false },
    createdBy: { type: mongoose.Types.ObjectId, ref: "Admin" }, //? Important for separate admin only
  },
  {
    timestamps: true,
  }
);

// Model
const Administrative = mongoose.model("Administrative", administrativeSchema);

module.exports = Administrative;

//todo: updated data
// const mongoose = require("mongoose");

// //====================== Basic Details Schema ========================
// const basicDetailsSchema = new mongoose.Schema({
//   // Personal Information
//   empCode: { type: String },
//   prefix: { type: mongoose.Types.ObjectId, ref: "Prefix" },
//   firstName: { type: String },
//   middleName: { type: String },
//   lastName: { type: String },
//   gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male" },
//   dateOfBirth: { type: Date },
//   adharNumber: { type: String },
//   panNumber: { type: String },
//   profilePhoto: { type: String },
//   isMarried: { type: Boolean, default: false },
//   spouseName: { type: String }, // ✅ fixed typo
//   dateOfAnniversary: { type: Date },

//   // Contact Information
//   contactNumber: { type: String },
//   alternateContactNumber: { type: String },
//   email: { type: String },
//   alternateEmail: { type: String },

//   // Address Information
//   residentialAddress: { type: String },
//   residentialPincode: { type: String },
//   residentialCity: { type: String },
//   residentialDistrict: { type: String },
//   residentialState: { type: String },

//   isPermanentSame: { type: Boolean, default: false },
//   permanentAddress: { type: String },
//   permanentPincode: { type: String },
//   permanentCity: { type: String },
//   permanentDistrict: { type: String },
//   permanentState: { type: String },

//   // Emergency Contacts
//   emergencyContacts: [
//     {
//       emergencyContactPersonName: { type: String },
//       emergencyAddress: { type: String },
//       emergencyContactPersonMobileNumber: { type: String },
//     },
//   ],

//   // Bank Information (Single Account)
//   nameOnBankAccount: { type: String },
//   bankAccountNumber: { type: String }, // ✅ changed from [String]
//   bankName: { type: String },          // ✅ changed from [String]
//   branchName: { type: String },        // ✅ changed from [String]
//   ifscCode: { type: String },
//   panCardNo: { type: String },
// });
// //====================================================================

// //================== Past Employment Details =========================
// const pastEmploymentDetailsSchema = new mongoose.Schema({
//   organisationName: { type: String },
//   designation: { type: String },
//   empCode: { type: String },
//   joiningDate: { type: Date },
//   relievingDate: { type: Date },
//   inHandSalary: { type: String },
//   yearsOfExperience: { type: String },
//   note: { type: String },
// });
// //====================================================================

// //================== Employment Details Schema =======================
// const employmentDetailsSchema = new mongoose.Schema({
//   departmentOrSpeciality: {
//     type: mongoose.Types.ObjectId,
//     ref: "DepartmentSetup",
//   },
//   department: {
//     type: mongoose.Types.ObjectId,
//     ref: "Department",
//   },
//   designation: {
//     type: mongoose.Types.ObjectId,
//     ref: "Designation",
//   },
//   postion: {
//     type: mongoose.Types.ObjectId,
//     ref: "Postion",
//   },
//   empRole: {
//     type: mongoose.Types.ObjectId,
//     ref: "EmployeeRole",
//   },
//   typeOfEmployee: { type: String },
//   joiningDate: { type: Date },
//   location: { type: String },
//   description: { type: String },
//   reportTo: { type: mongoose.Types.ObjectId, ref: "Administrative" },
// });
// //====================================================================

// //======================= Documentation Schema =======================
// const documentationSchema = new mongoose.Schema(
//   {
//     name: { type: String },
//     file: { type: String, default: null },
//   },
//   { _id: false }
// );
// //====================================================================

// //======================= Education Schema ===========================
// const educationSchema = new mongoose.Schema(
//   {
//     qualification: { type: String },
//     yearOfPassing: { type: Number },
//     universityOrBoard: { type: String },
//   },
//   { _id: false }
// );
// //====================================================================

// //======================= System Rights Schema =======================
// const systemRightsSchema = new mongoose.Schema({
//   authorizedIds: {
//     type: Map,
//     of: Boolean,
//   },
//   actionPermissions: {
//     type: Map,
//     of: new mongoose.Schema(
//       {
//         Add: { type: Boolean, default: false },
//         View: { type: Boolean, default: false },
//         Edit: { type: Boolean, default: false },
//         Delete: { type: Boolean, default: false },
//       },
//       { _id: false }
//     ),
//   },
// });
// //====================================================================

// //===================== Salary and Wages Schema ======================
// const DeductionComponentSchema = new mongoose.Schema(
//   {
//     employee: Number,
//     employer: Number,
//   },
//   { _id: false }
// );

// const SalaryAndWages = new mongoose.Schema({
//   employeeId: String,
//   name: String,
//   designation: String,
//   incomeDetails: {
//     basicSalary: Number,
//     incomeComponents: {
//       type: Map,
//       of: Number,
//       default: {},
//     },
//     grossMonthlyIncome: Number,
//   },
//   deductionDetails: {
//     deductionComponents: {
//       type: Map,
//       of: DeductionComponentSchema,
//       default: {},
//     },
//     totalEmployeeContributions: Number,
//     totalEmployerContributions: Number,
//   },
// });
// //====================================================================

// //==================== Final Administrative Schema ===================
// const administrativeSchema = new mongoose.Schema(
//   {
//     basicDetails: basicDetailsSchema,
//     pastEmploymentDetails: [pastEmploymentDetailsSchema],
//     employmentDetails: employmentDetailsSchema,
//     documentation: [documentationSchema], // ✅ updated from Map to array of docs
//     educationDetails: [educationSchema],  // ✅ updated from plain array to schema
//     systemRights: systemRightsSchema,
//     salaryAndWages: SalaryAndWages,
//     delete: { type: Boolean, default: false },
//     createdBy: { type: mongoose.Types.ObjectId, ref: "Admin" },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Model Export
// const Administrative = mongoose.model("Administrative", administrativeSchema);

// module.exports = Administrative;
