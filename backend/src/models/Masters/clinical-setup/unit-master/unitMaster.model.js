const { Schema, model } = require("mongoose");

const unitMasterSchema = new Schema(
  {
    unit: {
      type: String,
      trim: true,
      required: true,
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

const clinicalUnitMasterModel = model("Clinical-Unit-Master", unitMasterSchema);
module.exports = clinicalUnitMasterModel;
