// const mongoose = require("mongoose");

// const OpdPatientSchema = new mongoose.Schema(
//   {
//     formType: { type: String, required: true },
//     patientType: { type: String, default: "" },
//     patientId: {
//       type: mongoose.Types.ObjectId,
//       ref: "Patient_Appointment",
//       default: null,
//     },
//     uhid: { type: String, required: true },
//     uhidId: {
//       type: mongoose.Types.ObjectId,
//       ref: "UHID",
//     },
//     opd_regNo: { type: String },
//     prefix: { type: String, default: "" },
//     prefixId: {
//       type: mongoose.Types.ObjectId,
//       ref: "prefix",
//       required: false,
//       default: null,
//     },
//     patientFirstName: { type: String, required: true },
//     patientMiddleName: { type: String, required: true },
//     patientLastName: { type: String, required: true },
//     dob: { type: Date, default: null },
//     age: { type: String, default: "" },
//     mobile_no: { type: Number, default: "" },
//     gender: { type: String, default: "" },
//     country: { type: String, default: "" },
//     state: { type: String, default: "" },
//     city: { type: String, default: "" },
//     address: { type: String, default: "" },
//     pincode: { type: Number, default: "" },
//     birthTime: { type: String, default: "" },
//     martialStatus: { type: String, default: "" },
//     aadhar_no: { type: Number, default: "" },
//     aadhar_card: { type: String, default: "" },
//     abha_no: { type: String, default: "" },
//     abha_card: { type: String, default: "" },
//     patientPhoto: { type: String, default: "" },
//     patientImpression: { type: String, default: "" },
//     departmentName: { type: String, default: "" },
//     departmentId: {
//       type: mongoose.Types.ObjectId,
//       ref: "DepartmentSetup",
//     },
//     consultantName: { type: String, default: "" },
//     consultantId: {
//       type: mongoose.Types.ObjectId,
//       ref: "Consultant",
//     },
//     patientPayee: { type: String, default: "" },
//     // patientPayeeId: {
//     //   type: mongoose.Types.ObjectId,
//     //   ref: "Patient_Payee",
//     //   required: false,
//     //   default: null,
//     // },

//     payeeCategory: { type: String, default: "" },
//     payeeCategoryId: {
//       type: mongoose.Types.ObjectId,
//       ref: "Parent_Group",
//     },
//     packagesType: { type: String, default: "" },
//     packageValidity: { type: String, default: "" },
//     referBy: { type: String, default: "" },
//     marketingCommunity: { type: String, default: "" },
//     note: { type: String, default: "" },
//     relativePrifix: { type: String, default: "" },
//     relativePrifixId: {
//       type: mongoose.Types.ObjectId,
//       ref: "prefix",
//       required: false,
//       default: null,
//     },
//     relative_name: { type: String, default: "" },
//     relative_mobile: { type: Number, default: "" },
//     relation: { type: String, default: "" },

//     status: {
//       type: String,
//       enum: ["Waiting", "Patient In", "Patient Out"],
//       default: "Waiting",
//     },

//     specialCase: {
//       type: Boolean,
//       default: true,
//     },

//     billingStatus: {
//       type: String,
//       enum: ["Non_Paid", "Paid", "Partially_Paid"],
//       default: "Non_Paid",
//     },
//     whoBookId: {
//       type: mongoose.Types.ObjectId,
//       ref: "Admin",
//     },
//     whoBookName: {
//       type: String,
//     },
//     patientIn: {
//       type: Boolean,
//       default: false,
//     },
//     tpa: {
//       type: String,
//       default: "",
//     },
//     tpaId: {
//       type: mongoose.Types.ObjectId,
//       ref: "TPA_Company_Master",
//       required: false,
//       default: null,
//     },
//     registrationDate: {
//       type: Date,
//       default: "",
//     },
//     registrationTime: {
//       type: String,
//       default: "",
//     },
//     cardNo: {
//       type: String,
//       trim: true,
//     },
//     beneficiaryId: {
//       type: String,
//       trim: true,
//     },
//     beneficiaryName: {
//       type: String,
//       trim: true,
//     },
//     validity: {
//       type: Date,
//     },
//     sumAssured: {
//       type: Number,
//     },
//     cardAttachment: {
//       type: String,
//     },
//     policyNo: {
//       type: String,
//       trim: true,
//     },
//     policyType: {
//       type: String,
//       trim: true,
//     },
//     schemeName: {
//       type: String,
//       trim: true,
//     },
//     abhaNumber: {
//       type: String,
//       trim: true,
//     },
//     employeeId: {
//       type: String,
//       trim: true,
//     },
//     charityIndigent: {
//       type: String,
//       trim: true,
//     },
//     charityWeaker: {
//       type: String,
//       trim: true,
//     },
//     charityCamp: {
//       type: String,
//       trim: true,
//     },
//     charityDocument: {
//       type: String,
//       default: "",
//     },
//     isPatientPaidTheBill: {
//       type: Boolean,
//       default: false,
//     },

//     tokenNo: {
//       type: Number,
//       default: 0,
//     },

//     date: {
//       type: String,
//       default: "",
//     },
//     formFillingTime: {
//       type: String,
//       default: "",
//     },
//     patientInTime: {
//       type: String,
//       default: "",
//     },
//     consultantNotificationId: {
//       type: String,
//       default: "",
//     },
//     time: {
//       type: String,
//       default: "",
//     },
//     requests: {
//       radiology: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Patient_Radiology",
//         default: null,
//       },
//       pathology: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Patient_Pathology",
//         default: null,
//       },
//       otherDiagnostics: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Patient_Diagnostics",
//         default: null,
//       },
//       procedure: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Patient_Procedure",
//         default: null,
//       },
//       crossConsultant: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "PatientCrossConsultationModel",
//         default: null,
//       },
//     },
//     billType: {
//       type: String,
//       default: "",
//       trim:true
//     },

//     delete: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("OPD_patient", OpdPatientSchema);
