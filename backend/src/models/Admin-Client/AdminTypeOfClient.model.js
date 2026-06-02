const mongoose = require("mongoose");

const AdmintypeOfClientSchema = new mongoose.Schema(
  {
    typeOfClient: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const AdminTypeOfClientModel = mongoose.model("AdmintypeOfClient", AdmintypeOfClientSchema);
module.exports = AdminTypeOfClientModel;
