const mongoose = require("mongoose");

const categoryOfOrganisationSchema = new mongoose.Schema(
  {
    categoryOfOrganisation: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const categoryOfOrganisationModel = mongoose.model(
  "categoryOfOrganisation",
  categoryOfOrganisationSchema
);
module.exports = categoryOfOrganisationModel;
