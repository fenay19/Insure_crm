const mongoose = require("mongoose");

const vitalSchema = new mongoose.Schema(
  {
    consultantId: {
      type: mongoose.Types.ObjectId,
      ref: "Consultant",
    },
    departmentId: {
      type: mongoose.Types.ObjectId,
      ref: "DepartmentSetup",
    },
    name: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: false,
    },
    answerType: {
      type: String,
      required: true,
    },
    problem: {
      type: String,
      required: true,
    },
    objective: {
      type: Array,
      default: [],
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

const VitalModel = mongoose.model("Vitals", vitalSchema);

module.exports = VitalModel;
