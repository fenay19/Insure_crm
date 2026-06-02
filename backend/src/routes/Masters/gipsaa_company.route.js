const express = require("express");
const gipsaaCompnayMasterRouter = express.Router();
const { handleToken } = require("../../utils/handleToken");
const {
  addGipsaaCompany,
  deleteGipsaaCompany,
  getGipsaaCompany,
  updateGipsaaCompany,
  bulkGipsaaCompanyImport,
} = require("../../controllers/Masters/gipsaa.controller");

// GET
gipsaaCompnayMasterRouter.get("/", handleToken, getGipsaaCompany);

// POST
gipsaaCompnayMasterRouter.post("/add", handleToken, addGipsaaCompany);

// PUT
gipsaaCompnayMasterRouter.put("/update/:id", handleToken, updateGipsaaCompany);

// DELETE
gipsaaCompnayMasterRouter.put("/delete/:id", handleToken, deleteGipsaaCompany);

// Bulk Import
gipsaaCompnayMasterRouter.post("/import", handleToken, bulkGipsaaCompanyImport);

module.exports = gipsaaCompnayMasterRouter;
