const mongoose = require("mongoose");

const ProcedureSchema = new mongoose.Schema(
  {
    procedureName: {
      type: String,
      required: true,
      trim: true,
    },
    delete: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const ProcedureModel = mongoose.model("Procedure_Master", ProcedureSchema);
module.exports = ProcedureModel;
