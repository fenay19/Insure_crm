const mongoose = require("mongoose");

const cooperateCompanyPrivateSchema = new mongoose.Schema(
  {
    cooperativeCompanyName: {
      type: String,
      required: false,
    },
    delete: {
      type: Boolean,
      default: false,
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

const coOperateCompanyPrivateModel = mongoose.model(
  "Co-Operate_Company_Master_Private",
  cooperateCompanyPrivateSchema
);

module.exports = coOperateCompanyPrivateModel;
