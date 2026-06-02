const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  user:{
    type: mongoose.Types.ObjectId,
    ref:'Admin'
  },
  storeName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  purchasingStatus: {
    type: String,
    enum: ['Yes', 'No'],
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  type :{
    type: String,
    required: true,
  },
  departmentId: {
    type: mongoose.Types.ObjectId,
    ref: 'DepartmentSetupModel'
  },
  forAll:Boolean,
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
  versionKey: false,
  timestamps: true,
});

const StoreModel = mongoose.model('Store', storeSchema);
module.exports = StoreModel
