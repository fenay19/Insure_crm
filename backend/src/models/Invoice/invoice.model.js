const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  product: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  productAmount: { type: Number, required: true },
});

const PaymentHistorySchema = new mongoose.Schema({
  transactionId: { type: String },
  paymentMode: { type: String },
  paidAmount: { type: Number, required: true },
  paymentBankName: { type: String },
  paymentDate: { type: Date, default: Date.now },
}); // ✅ now each history item will have its own _id automatically

const InvoiceSchema = new mongoose.Schema({
  // Client details
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  gstType: { type: String, required: true },
  clientId: { type: String, required: true },
  clientName: { type: String, required: true },
  invoiceNumber: { type: String, required: true },
  RecieptNo: { type: String, required: true },
  date: { type: Date, required: true },
  clientGst: { type: String },
  clientEmail: { type: String, required: true },
  clientAddress: { type: String, required: true },
  clientPincode: { type: String, required: true },
  clientState: { type: String, required: true },
  clientCity: { type: String, required: true },
  clientCountry: { type: String, required: true },

  // Products
  products: {
    type: [ProductSchema],
    required: true,
    validate: (v) => Array.isArray(v) && v.length > 0,
  },

  // Invoice summary
  subTotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  discountType: { type: String },
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  roundUp: { type: Number, default: 0 },

  // Tax details
  igstPercent: { type: Number },
  igstAmount: { type: Number, default: 18 },
  cgstIgstPercentage: { type: Number },
  cgstIgstAmount: { type: Number },
  sgstPercentage: { type: Number },
  sgstAmount: { type: Number },

  // Bank details
  selectedBankId: { type: mongoose.Schema.Types.ObjectId, ref: "BankDetails" },

  status: { type: String, default: "unpaid" },

  // Latest payment details
  paymentDetails: {
    transactionId: { type: String },
    paymentMode: { type: String },
    paidAmount: { type: String },
    paymentBankName: { type: String },
    paymentDate: { type: String },
    invoiceId: { type: String },
  },

  // 📌 Payment history
  history: {
    type: [PaymentHistorySchema],
    default: [],
  },

  // 📌 Total paid amount
  totalPaidAmount: {
    type: Number,
    default: 0,
  },
});

// Compound unique index to enforce uniqueness per company
InvoiceSchema.index({ companyId: 1, invoiceNumber: 1 }, { unique: true });

const InvoiceModel = mongoose.model("Invoice", InvoiceSchema);
module.exports = InvoiceModel;
