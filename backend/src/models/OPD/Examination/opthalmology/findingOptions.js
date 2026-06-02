const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  finding: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
    enum: ["iop", "color", "contrast"],
  },
  eye: {
    type: String,
    trim: true,
    enum: ["RE", "LE"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FindingsOption = mongoose.model("FindingsOption", optionSchema);

module.exports = FindingsOption;
