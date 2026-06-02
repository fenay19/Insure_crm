const mongoose = require('mongoose');
const otMasterSchema = new mongoose.Schema({
    user:{
      type:mongoose.Types.ObjectId,
      ref: 'Admin'
    },
    roomNo: {
      type: String,
      required: true,
    },
    departmentId: [{
      type: mongoose.Types.ObjectId,
      ref: 'DepartmentSetupModel'
    }],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
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
  
  const OTMasterSchema = mongoose.model('OT_Master', otMasterSchema);
  module.exports = OTMasterSchema
  