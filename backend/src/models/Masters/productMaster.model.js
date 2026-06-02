const mongoose = require("mongoose");

const productMasterSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    productName: {
      type: String,
      require: true,
    },
    brandName: {
      type: String,
      require: true,
    },
    productId: {
      type: String,
      require: true,
    },
    sku: {
      type: String,
      require: true,
      // unique: true
    },
    hsn: {
      type: String,
      require: true,
    },
    unit: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    store: {
      type: String,
      require: true,
    },
    productType: {
      type: String,
    },
    party: {
      type: String,
    },
    partyId: {
      type: mongoose.Types.ObjectId,
      ref: "PartyMaster",
    },
    purchase: {
      type: String,
      require: true,
    },
    sales: {
      type: String,
      require: true,
    },
    consumption: {
      type: String,
      require: true,
    },
    purchaseGST: {
      type: String,
      require: true,
    },
    salesGST: {
      type: String,
      require: true,
    },
    genericName: {
      type: String,
      require: true,
    },
    sheduledDrug: {
      type: String,
      require: true,
    },
    delete: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ProductMasterModel = mongoose.model("ProductMaster", productMasterSchema);

module.exports = ProductMasterModel;
