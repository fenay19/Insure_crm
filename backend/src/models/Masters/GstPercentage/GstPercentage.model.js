const mongoose = require("mongoose");

const gstPercentageSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    cgst: {
      type: Number,
      // required: true,
    },
    sgst: {
      type: Number,
      // required: true,
    },
    ugst: {
      type: Number,
      // required: true,
    },
    igst: {
      type: Number,
      // required: true,
    },
    effectiveFrom: {
      type: Date,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    isDeleted: {
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

const GstPercentageModel = mongoose.model("GstPercentage", gstPercentageSchema);

module.exports = GstPercentageModel;
