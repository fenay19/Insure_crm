const mongoose = require("mongoose");

// Define the schema
const incomeSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    income: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    delete: {
      type: Boolean,
      default: false, // Default value is false, meaning the record is not deleted by default
    },
  },
  { timestamps: true }
);

// Create a model based on the schema
const IncomeModel = mongoose.model("Income", incomeSchema);

module.exports = IncomeModel;
