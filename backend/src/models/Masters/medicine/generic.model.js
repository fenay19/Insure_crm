const mongoose = require("mongoose");

const GenericSchema = new mongoose.Schema(
  {
    genericName: {
      type: String,
      required: false,
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

const GenericModel = mongoose.model("genericMaster", GenericSchema);

module.exports = GenericModel;
