const mongoose = require('mongoose')

// Define Parameters schema
const ParametersSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true
  },
  b2bPrice: {
    type: String,
    required: true
  },
  b2cPrice: {
    type: String,
    required: true
  }
})

// Define Outsource Diagnostic schema
const outsourceDiagnosticSchema = new mongoose.Schema(
  {
    labName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    },
    departmentId: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'DepartmentSetup'
      }
    ],
    addOtherLab: [
      {
        labName: {
          type: String,
          required: true
        },
        address: {
          type: String,
          required: true
        },
        contact: {
          type: String,
          required: true
        },
        departmentId: [
          {
            type: mongoose.Types.ObjectId,
            ref: 'DepartmentSetup'
          }
        ]
      }
    ],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    delete: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const OutsourceDiagnosticsModel = mongoose.model(
  'OutsourceDiagnostic',
  outsourceDiagnosticSchema
)

module.exports = OutsourceDiagnosticsModel
