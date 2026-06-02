const mongoose = require("mongoose");

const marineClauseSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    marineClause: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const marineClauseModel = mongoose.model("marineClause", marineClauseSchema);
module.exports = marineClauseModel;
