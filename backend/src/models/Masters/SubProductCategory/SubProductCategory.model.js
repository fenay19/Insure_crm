const mongoose = require("mongoose");

const SubProductCategorySchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    productName: { type: String, required: true },
    subProductName: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SubProductCategoryModel = mongoose.model(
  "SubProductCategory",
  SubProductCategorySchema
);

module.exports = SubProductCategoryModel;
