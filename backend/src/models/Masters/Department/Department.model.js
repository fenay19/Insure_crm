const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const departmentModel = mongoose.model("department", departmentSchema);
module.exports = departmentModel;
