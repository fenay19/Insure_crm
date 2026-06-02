const express = require("express");
const companySettingsRouter = express.Router();
const { CompanySettingsController } = require("../../controllers/index");
const { handleToken } = require("../../utils/handleToken");

companySettingsRouter.get(
  "/",
  CompanySettingsController.getCompanySettingsController
);
companySettingsRouter.get(
  "/:id",
  handleToken,
  CompanySettingsController.getCompanySettingsByIdController
);
companySettingsRouter.post(
  "/",
  handleToken,
  CompanySettingsController.postCompanySettingsController
);
companySettingsRouter.put(
  "/:id",
  handleToken,
  CompanySettingsController.putCompanySettingsController
);
companySettingsRouter.delete(
  "/:id",
  handleToken,
  CompanySettingsController.deleteCompanySettingsController
);
companySettingsRouter.get(
  "/:id/logo",
  handleToken,
  CompanySettingsController.getCompanyLogoController
);

module.exports = companySettingsRouter;
