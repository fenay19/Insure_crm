const mongoose = require("mongoose");

const serviceDetailsMasterSchema = new mongoose.Schema(
  {
    count: {
      type: Number,
      default: 0,
    },
    // patientPayee: {
    //   type: String,
    //   require: false,
    // },
    // patientPayeeId: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "Patient_Payee",
    // },

    // payeeCategory: {
    //   type: String,
    //   required: false,
    // },

    // payeeCategoryId: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "Parent_Group",
    // },

    patientEncounter: [],
    detailServiceName: {
      type: String,
      require: false,
    },
    serviceGroupOrBillGroup: {
      type: String,
      require: false,
    },
    serviceGroupOrBillGroupId: {
      type: mongoose.Types.ObjectId,
      ref: "BillGroup",
    },
    serviceCode: {
      type: String,
      require: false,
    },
    ledger: { type: String, required: false },
    ledgerId: { type: mongoose.Types.ObjectId, ref: "Ledger" },
    subLedger: { type: String },
    subLedgerId: { type: mongoose.Types.ObjectId, ref: "Sub_Ledger" },
    alternateServiceName: {
      type: String,
      required: false,
    },
    department: {
      type: [String],
      required: false,
    },
    departmentId: {
      type: [String],
      required:false
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    whichService: {
      type: String,
      required: false,
    },
    investigationId: {
      type: String,
      required: false,
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
    timestamps: false,
    versionKey: false,
  }
);

const ServiceDetailsMasterModel = mongoose.model(
  "ServiceDetailsMaster",
  serviceDetailsMasterSchema
);

module.exports = ServiceDetailsMasterModel;
