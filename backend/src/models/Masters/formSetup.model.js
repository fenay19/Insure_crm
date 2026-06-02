const mongoose = require("mongoose");

const NestedFieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  children: [this], 
});

const FormSetupSchema = new mongoose.Schema(
  {
    department: { type: String },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepartmentSetup",
    },
    complaints: [NestedFieldSchema],
    medicalHistory: [NestedFieldSchema],
    examinations: [NestedFieldSchema],
    medicalPrescription: [NestedFieldSchema],
    provisionalDiagnosis: [NestedFieldSchema],
    finalDiagnosis: [NestedFieldSchema],
    follow: [NestedFieldSchema],
  },
  {
    timestamps: true,
  }
);

const FormSetupModel = mongoose.model("FormSetup", FormSetupSchema);

module.exports = FormSetupModel;
