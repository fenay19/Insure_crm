const mongoose = require('mongoose')

const designationSchema = new mongoose.Schema(
  {
    designationName: {
      type: String,
      required: true,
    },
    designationCode: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    empRole: {
      type: String,
      required: false
    },
    empRoleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmployeeRole',
      required: false
    },

    designationFunction: {
      clinical: {
        type: Boolean,
        default: false
      },
      administrative: {
        type: Boolean,
        default: false
      },
      finance: {
        type: Boolean,
        default: false
      }
    },

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
    versionKey: false,
    timestamps: true
  }
)

const DesignationModel = mongoose.model('Designation', designationSchema)
module.exports = DesignationModel
