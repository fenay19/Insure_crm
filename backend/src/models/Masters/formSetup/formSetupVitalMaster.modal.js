// // models/VitalData.js
const mongoose = require("mongoose");

// const formSetupVitalSchema = new mongoose.Schema(
//   {
//     heading: { type: String },
//     unit: { type: String, required: false },
//     // Groups: { type: String, required: false },

//     parameters: {
//       type: Map,
//       of: [String],
//       default: {},
//     },

//     departmentId: {
//       type: mongoose.Types.ObjectId,
//       ref: "DepartmentSetup",
//     },
//     patientId: {
//       type: mongoose.Types.ObjectId,
//       ref: "OPD_patient",
//       required: false,
//     },
//     consultantId: {
//       type: mongoose.Types.ObjectId,
//       ref: "Consultant",
//     },
//     inputVal: {
//       type: String,
//     },

//     selectedCheckboxes: { type: [String], default: [] },
//     selectedRange: { type: String },
//   },
//   { timestamps: true }
// );

const patientVitalSchema = new mongoose.Schema(
  {
    respiratoryRate: {
      type: [
        {
          vitalName: String,
          selectedParameters: Object,
          selectedRangeCategory: String,
          selectedRangeValue: Number,
          unit: String,
        },
      ],
      default: [],
      _id: true, // Prevents auto-generating an ID for the array itself
    },

    pulseRate: {
      type: [
        {
          vitalName: String,
          selectedParameters: Object,
          selectedRangeCategory: String,
          selectedRangeValue: Number,
          unit: String,
        },
      ],
      default: [],
      _id: true,
    },

    height: {
      type: [
        {
          vitalName: String,
          height: Number,
          unit: String,
        },
      ],
      default: [],
      _id: true,
    },

    weight: {
      type: [
        {
          vitalName: String,
          weight: Number,
          unit: String,
        },
      ],
      default: [],
      _id: true,
    },

    bodyMassIndex: {
      type: [
        {
          bmiValue: String,
          bmiType: String,
          unit: String,
          vitalName: String,
        },
      ],
      default: [],
      _id: true,
    },

    bloodPressure: {
      type: [
        {
          vitalName: String,
          ranges: {
            systolic: Number,
            diastolic: Number,
          },
          unit: String,
        },
      ],
      default: [],
      _id: true,
    },

    temperature: {
      type: [
        {
          vitalName: String,
          methods: [String],
          value: String,
          unit: String,
        },
      ],
      default: [],
      _id: true,
    },

    bloodOxygenSaturation: {
      type: [
        {
          vitalName: String,
          range: Number,
          unit: String,
        },
      ],
      default: [],
      _id: true,
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepartmentSetup",
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OPD_patient",
      required: false,
    },
    consultantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultant",
    },
  },
  { timestamps: true }
);

const PatientVital = mongoose.model("PatientVital", patientVitalSchema);
module.exports = PatientVital;
