const mongoose = require("mongoose");

const subCustomerGroupSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    customerGroupName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customerGroup",
      required: true,
    },
    subCustomerGroup: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const subCustomerGroupModel = mongoose.model(
  "subCustomerGroup",
  subCustomerGroupSchema
);
module.exports = subCustomerGroupModel;
