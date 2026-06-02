const mongoose = require("mongoose");

const otherDiagnosticsSchema = new mongoose.Schema(
  {
    count: {
      type: Number,
      default: 0,
    },
    testName: {
      type: String,
      required: false,
    },
    machineName: {
      type: String,
      required: false,
    },
    machineId: {
      type: String,
    },
    testType: {
      type: String,
      required: false,
    },
    testRange: {
      type: String,
      required: false,
      default: null,
    },
    description: {
      type: Array,
      required: false,
      default: null,
    },
    department: {
      type: Array,
    },
    departmentId: {
      type: Array,
      // ref: "DepartmentSetupModel",
    },
    billGroup: {
      type: String,
      required: false,
    },
    billGroupId: {
      type: mongoose.Types.ObjectId,
      ref: "BillGroup",
    },
    cash: {
      type: Number,
      min: 0,
    },
    CGHSnabh: {
      type: Number,
      min: 0,
    },
    CGHSnonNabh: {
      type: Number,
      min: 0,
    },
    tpaName: {
      type: String,
      default: "",
    },
    tpa: {
      type: Number,
      min: 0,
    },
    gipsaaName: {
      type: String,
      default: "",
    },
    gipsaa: {
      type: Number,
      min: 0,
    },
    charity: {
      type: Number,
      default: 0,
      min: 0,
    },
    rate: {
      type: String,
    },
    newCode: {
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
    versionKey: false,
    timestamps: false,
  }
);

const OtherDiagnosticsModel = mongoose.model(
  "OtherDiagnosticsMaster",
  otherDiagnosticsSchema
);
module.exports = OtherDiagnosticsModel;
