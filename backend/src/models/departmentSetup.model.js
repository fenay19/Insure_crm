const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      required: true,
    },
    departmentCode: {
      type: String,
      // required: true,
    },
    departmentType: {
      type: String,
      required: true,
    },
    departmentSubType: {
      type: String,
      required: true,
    },
    departmentBranch: {
      type: String,
    },
    serviceLedger: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      // required: true,
    },
    departmentFunction: {
      isLab: {
        type: Boolean,
        default: false,
      },
      isPharmacy: {
        type: Boolean,
        default: false,
      },
      isSpeciality: {
        type: Boolean,
        default: false,
      },
      isRadiology: {
        type: Boolean,
        default: false,
      },
      Other: {
        type: Boolean,
        default: false,
      },
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

const DepartmentSetupModel = mongoose.model(
  "DepartmentSetup",
  departmentSchema
);
module.exports = DepartmentSetupModel;
