const mongoose = require("mongoose");

const opdCreditBillSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient_Appointment",
      required: false,
    },

    opdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OPD_patient",
      required: false,
    },

    // receipts: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Opd_Receipt",
    //   },
    // ],

    tokenNo: {
      type: Number,
      default: 0,
    },

    services: [
      {
        type: Object, // If services have multiple details, use an object or define a schema
      },
    ],

    discountCharges: {
      type: Number,
      default: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    pendingAmount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    servicesAmount: {
      type: Number,
      default: 0,
    },

    billNo: {
      type: String,
      default: "N/A",
    },

    billDate: {
      type: String, // You might want to store this as Date type if used in date calculations
    },

    personWhoCreatedBill: {
      type: String,
      default: "",
    },

    employeeCode: {
      type: String,
      default: "",
    },

    delete: {
      type: Boolean,
      default: false,
    },

    deleteAt: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

const OpdCreditBill = mongoose.model("OPD_credit_bill", opdCreditBillSchema);

module.exports = OpdCreditBill;
