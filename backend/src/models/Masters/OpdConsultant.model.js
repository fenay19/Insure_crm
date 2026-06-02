const mongoose = require("mongoose");

const OpdConsultantSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["New", "Follow Up"],
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    consultantName: {
      type: String,
      required: true,
    },
    consultantId:{
      type:mongoose.Types.ObjectId,
      ref:"Consultant"
    },
    billGroup: {
      type: String,
      required: true,
    },
    newCode: {
      type: String,
    },
    rate: {
      type: String,
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
  }
);

module.exports = mongoose.model("opdConsultantService", OpdConsultantSchema);
