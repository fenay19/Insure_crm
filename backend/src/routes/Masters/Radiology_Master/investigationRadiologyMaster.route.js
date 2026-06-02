const express = require("express");
const investigationRadiologyMasterRoute = express.Router();
const {
  InvestigationRadiologyMasterController,
} = require("../../../controllers");
const {
  validateInvestigationRadiologyMaster,
} = require("../../../validations/Masters/Radiology_Master/investigationRadiologyMaster.validations");
const { handleToken } = require("../../../utils/handleToken");

investigationRadiologyMasterRoute.get(
  "/",
  handleToken,
  InvestigationRadiologyMasterController.getAllInvestigation
);

investigationRadiologyMasterRoute.post(
  "/",
  handleToken,
  InvestigationRadiologyMasterController.addInvestigation
);

investigationRadiologyMasterRoute.post(
  "/import",
  handleToken,
  InvestigationRadiologyMasterController.bulkImport
);

investigationRadiologyMasterRoute.put(
  "/:id",
  handleToken,
  InvestigationRadiologyMasterController.editInvestigation
);
investigationRadiologyMasterRoute.put(
  "/update-rate/:id",
  handleToken,
  InvestigationRadiologyMasterController.updateInvestigationRateAndCode
);

investigationRadiologyMasterRoute.put(
  "/delete/:id",
  handleToken,
  InvestigationRadiologyMasterController.deleteInvestigation
);

module.exports = investigationRadiologyMasterRoute;
