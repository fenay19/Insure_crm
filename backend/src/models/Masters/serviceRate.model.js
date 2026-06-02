const mongoose = require("mongoose");

const AddServiceRateSchema = new mongoose.Schema(
  {
    serviceGroup: {
      type: String,
      required: true, 
      trim: true,
    },
    serviceGroupId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "BillGroup", 
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },
    serviceNameId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "ServiceDetailsMaster", 
      required: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepartmentSetup", 
      required: true,
    },
    
    cash: {
      type: Number,
      required: true,
      min: 0,
    },
    CGHSnabh: {
      type: Number,
      required: true,
      min: 0,
    },
    CGHSnnoNabh: {
      type: Number,
      required: true,
      min: 0,
    },
    tpa: {
      type: Number,
      required: true,
      min: 0,
    },
    insurance: {
      type: Number,
      required: true,
      min: 0,
    },
    other: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, 
    versionKey: false, 
  }
);

module.exports = mongoose.model("ServiceRate", AddServiceRateSchema);
