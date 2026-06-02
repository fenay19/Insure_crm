const express = require("express");
const companyRouter = express.Router();
const { prospectController } = require("../../controllers/index");

const { handleToken } = require('../../utils/handleToken')

companyRouter.post("/", handleToken, prospectController.createProspectController);
companyRouter.get("/", handleToken, prospectController.getProspectController);
companyRouter.get("/:id", handleToken, prospectController.getByIdProspectController);
companyRouter.put("/:id",handleToken, prospectController.updateProspectController);
companyRouter.delete("/:id",handleToken, prospectController.deleteProspectController);

module.exports = companyRouter;

//   getProspectController,
//   getByIdProspectController,
//   createProspectController,
//   updateProspectController,
//   deleteProspectController,
