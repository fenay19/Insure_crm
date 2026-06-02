const mongoose = require("mongoose");

const GipsaaCompanyMasterSchema = new mongoose.Schema(
  {
    gipsaaCompanyName: {
      type: String,
      required: false,
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

const GipsaaCompanyMasterModel = mongoose.model(
  "Gipsaa_Company_Master",
  GipsaaCompanyMasterSchema
);

module.exports = GipsaaCompanyMasterModel;
