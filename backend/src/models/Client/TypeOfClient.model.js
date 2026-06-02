const mongoose = require("mongoose");

const typeOfClientSchema = new mongoose.Schema(
  {
    typeOfClient: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const TypeOfClientModel = mongoose.model("typeOfClient", typeOfClientSchema);
module.exports = TypeOfClientModel;
