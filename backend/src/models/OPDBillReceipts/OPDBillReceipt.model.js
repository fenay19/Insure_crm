const mongoose = require("mongoose");

const OPDBillReceiptSchema = new mongoose.Schema(
  {
    receiptNo: {
      type: String,
      default: "",
    },

    tokenNo: {
      type: Number,
      default: 0,
    },

    opdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OPD_patient",
      required: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient_Appointment",
    },

    services: {
      type: Array,
    },

    charges: {
      type: Number,
      default: 0,
    },

    transactionId: {
      type: String,
      default: null,
      required: false,
    },

    cardNo: {
      type: String,
      default: null,
      required: false,
    },

    cardPersonName: {
      type: String,
      default: null,
      required: false,
    },

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

    finalAmount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    payType: {
      type: String,
      default: null,
    },

    paymentMode: {
      type: String,
      default: null,
    },

    paymentModeId: {
      type: String,
      ref: "PaymentMode",
      default: null,
    },

    invoiceNo: {
      type: String,
    },

    billNo: {
      type: String,
    },

    billDate: {
      type: String,
    },

    personWhoCreatedThisBillName: {
      type: String,
      default: "",
    },

    personWhoCreatedThisBillId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    personWhoCreatedThisBillRefType: {
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
    timestamps: true,
  }
);

const OPDReceiptModel = mongoose.model("Opd_Receipt", OPDBillReceiptSchema);
module.exports = OPDReceiptModel;
