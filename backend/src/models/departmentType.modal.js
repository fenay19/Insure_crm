const mongoose = require('mongoose')

const departmentTypeSchema = new mongoose.Schema(
  {
    departmentTypeName: {
      type: String,
      required: true
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

const DepartmentTypeModel = mongoose.model(
  'DepartmentType',
  departmentTypeSchema
)
module.exports = DepartmentTypeModel
