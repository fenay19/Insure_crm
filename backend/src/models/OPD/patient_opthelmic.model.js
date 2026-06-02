const mongoose = require("mongoose");

const VisionSchema = new mongoose.Schema(
  {
    vision: [
      {
        unaidedRE: { type: String, required: false },
        unaidedLE: { type: String, required: false },
        correctedRE: { type: String, required: false },
        correctedLE: { type: String, required: false },
        pinholeRE: { type: String, required: false },
        pinholeLE: { type: String, required: false },
        newVisionRE: { type: String, required: false },
        newVisionLE: { type: String, required: false },
      },
    ],
    patientId: { type: mongoose.Types.ObjectId, ref: "Patient_Appointment" },
    opdPatientId: { type: mongoose.Schema.Types.ObjectId, ref: "OPD_patient" },
    departmentId: { type: mongoose.Types.ObjectId, ref: "DepartmentSetup" },
    consultantId: { type: mongoose.Types.ObjectId, ref: "Consultant" },
  },
  { timestamps: false }
);

const FindingsSchema = new mongoose.Schema(
  {
    findings: [
      {
        iopMethod: { type: String, required: false },
        iopRE: { type: String, required: false },
        iopLE: { type: String, required: false },
        colorMethod: { type: String, required: false },
        colorRE: { type: Array, required: false },
        colorLE: { type: Array, required: false },
        contrastMethod: { type: String, required: false },
        contrastRE: { type: String, required: false },
        contrastLE: { type: String, required: false },
      },
    ],
    patientId: { type: mongoose.Types.ObjectId, ref: "Patient_Appointment" },
    opdPatientId: { type: mongoose.Schema.Types.ObjectId, ref: "OPD_patient" },
    departmentId: { type: mongoose.Types.ObjectId, ref: "DepartmentSetup" },
    consultantId: { type: mongoose.Types.ObjectId, ref: "Consultant" },
  },
  { timestamps: false }
);

const AutoRefractionSchema = new mongoose.Schema(
  {
    autoRefraction: [
      {
        sphericalRE: { type: String, required: false },
        sphericalLE: { type: String, required: false },
        cylinderRE: { type: String, required: false },
        cylinderLE: { type: String, required: false },
        axisRE: { type: String, required: false },
        axisLE: { type: String, required: false },
        eyeDrop: { type: String, required: false },
      },
    ],
    patientId: { type: mongoose.Types.ObjectId, ref: "Patient_Appointment" },
    opdPatientId: { type: mongoose.Schema.Types.ObjectId, ref: "OPD_patient" },
    departmentId: { type: mongoose.Types.ObjectId, ref: "DepartmentSetup" },
    consultantId: { type: mongoose.Types.ObjectId, ref: "Consultant" },
  },
  { timestamps: false }
);

const AutoRefractionSchemaDilated = new mongoose.Schema(
  {
    autoRefraction: [
      {
        sphericalRE: { type: String, required: false },
        sphericalLE: { type: String, required: false },
        cylinderRE: { type: String, required: false },
        cylinderLE: { type: String, required: false },
        axisRE: { type: String, required: false },
        axisLE: { type: String, required: false },
        eyeDrop: { type: String, required: false },
      },
    ],
    patientId: { type: mongoose.Types.ObjectId, ref: "Patient_Appointment" },
    opdPatientId: { type: mongoose.Schema.Types.ObjectId, ref: "OPD_patient" },
    departmentId: { type: mongoose.Types.ObjectId, ref: "DepartmentSetup" },
    consultantId: { type: mongoose.Types.ObjectId, ref: "Consultant" },
  },
  { timestamps: false }
);
const VisionModel = mongoose.model("patient_opthelmic_vision", VisionSchema);
const FindingsModel = mongoose.model(
  "patient_opthelmic_findings",
  FindingsSchema
);
const AutoRefractionModel = mongoose.model(
  "patient_opthelmic_autoRefraction",
  AutoRefractionSchema
);
const AutoRefractionModelDilated = mongoose.model(
  "patient_opthelmic_autoRefraction_dilated",
  AutoRefractionSchemaDilated
);

module.exports = {
  VisionModel,
  FindingsModel,
  AutoRefractionModel,
  AutoRefractionModelDilated,
};
