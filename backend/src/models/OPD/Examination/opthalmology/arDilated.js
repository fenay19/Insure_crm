const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
    enum: ["spherical", "cylinder", "axis"],
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

const ArDilatedModel = mongoose.model("AR_dilated", optionSchema);

module.exports = ArDilatedModel;
