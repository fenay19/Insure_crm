const mongoose = require('mongoose');

const departmentSubTypeSchema = new mongoose.Schema({
  departmentSubTypeName: {
    type: String,
    required: true,
  },
  departmentTypeId: {
    type: mongoose.Types.ObjectId,
    ref: 'DepartmentType',
    required: true,
  },
  delete: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
}, {
  timestamps: true,
  versionKey: false,
});

const DepartmentSubTypeModel = mongoose.model('DepartmentSubType', departmentSubTypeSchema);
module.exports = DepartmentSubTypeModel;