const { Schema, model } = require("mongoose");

const vitalsMasterSchema = new Schema(
  {
    vital: {
      type: String,
      trim: true,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    group: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    range: {
      type: String,
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

const VitalMasterModel = model("Clinical-Vital", vitalsMasterSchema);
module.exports = VitalMasterModel;
