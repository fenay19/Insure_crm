const mongoose = require("mongoose");

const professionSchema = new mongoose.Schema(
  {
    profession: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const professionModel = mongoose.model("profession", professionSchema);
module.exports = professionModel; 
