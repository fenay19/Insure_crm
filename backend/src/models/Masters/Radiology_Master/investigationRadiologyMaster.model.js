const mongoose = require("mongoose");

const InvestigationRadiologySchema = new mongoose.Schema(
  {
    count: {
      type: Number,
      default: 0,
    },
    testName: {
      type: String,
      required: true,
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
      required: true,
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
      type: String,
      required: true,
    },
    departmentId: {
      type: mongoose.Types.ObjectId,
      ref: "DepartmentSetupModel",
    },
    billGroup: {
      type: String,
      required: true,
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
    timestamps: true,
  }
);

const InevestigationRadiologyMasterModel = mongoose.model(
  "InvestigationRadiologyMaster",
  InvestigationRadiologySchema
);
module.exports = InevestigationRadiologyMasterModel;
