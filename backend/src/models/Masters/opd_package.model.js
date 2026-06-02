const mongoose = require("mongoose");


const serviceSchema = {
  serviceId: {
    type: mongoose.Types.ObjectId,
    ref: "ServiceDetailsMaster",
  },
  detailServiceName: String,
  // existingAmount: String,
  // proposedAmount: String
};

const pathologyTestSchema = {
  serviceId: {
    type: mongoose.Types.ObjectId,
    ref: "InvestigationPathologyMaster",
  },
  detailServiceName: String,
};
const pathologyProfileSchema = {
  serviceId: {
    type: mongoose.Types.ObjectId,
    ref: "InvestigationPathologyMaster",
  },
  detailServiceName: String,
};

const radiologySchema = {
  serviceId: {
    type: mongoose.Types.ObjectId,
    ref: "InvestigationRadiologyMaster",
  },
  detailServiceName: String,
};

const diagnosticsSchema = {
  serviceId: {
    type: mongoose.Types.ObjectId,
    ref: "OtherDiagnosticsMaster",
  },
  detailServiceName: String,
};

const departmentConsultantsSchema = new mongoose.Schema({
  departmentId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "DepartmentSetup",
  },
  consultants: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Consultant",
      required: true,
    },
  ],
}, { _id: false });

const OPDPackageSchema = new mongoose.Schema(
  {
    count: {
      type: Number,
      default: 0,
    },
    patientType: String,

    // empanelment:String,
    patientEncounter: [],
    opdPackageName: String,
    visit: String,
    duration: String,
    serviceGroupOrBillGroup: String,
    serviceGroupOrBillGroupId: {
      type: mongoose.Types.ObjectId,
      ref: "BillGroup",
    },
    serviceCode: String,
    ledger: { type: String, required: false },
    ledgerId: { type: mongoose.Types.ObjectId, ref: "Ledger" },
    subLedger: { type: String },
    subLedgerId: { type: mongoose.Types.ObjectId, ref: "Sub_Ledger" },
    othersServices: {
      services: [serviceSchema],
      pathologyTest: [pathologyTestSchema],
      pathologyProfile: [pathologyProfileSchema],
      radiology: [radiologySchema],
      otherDiagnostics: [diagnosticsSchema],
    },
    department: {
      type: [String],
      required: true,
    },
    departmentId: {
      type: [String],
      required:true
    },
    DepartmentConsultants: [departmentConsultantsSchema],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
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
    timestamps: true,
    versionKey: false,
  }
);

const OPDPackageModel = mongoose.model("OPD_Packages_Master", OPDPackageSchema);

module.exports = OPDPackageModel;
