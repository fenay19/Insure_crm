const mongoose = require("mongoose");

const TypeSchema = new mongoose.Schema(
  {
    typeName: {
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

const TypeModel = mongoose.model("typeMaster", TypeSchema);

module.exports = TypeModel;
