const express = require("express");
const insuranceCompnayMasterRouter = express.Router();
const { InsuranceCompanyController } = require("../../controllers");
const { handleToken } = require("../../utils/handleToken");

// TPA Company
insuranceCompnayMasterRouter.get(
  "/tpa",
  handleToken,
  InsuranceCompanyController.getTpaCompany
);
insuranceCompnayMasterRouter.post(
  "/tpa",
  handleToken,
  InsuranceCompanyController.addTpaCompany
);
insuranceCompnayMasterRouter.put(
  "/tpa/:id",
  handleToken,
  InsuranceCompanyController.updateTpaCompany
);
insuranceCompnayMasterRouter.put(
  "/tpa/delete/:id",
  handleToken,
  InsuranceCompanyController.deleteTpaCompany
);
insuranceCompnayMasterRouter.post(
  "/tpa/import",
  handleToken,
  InsuranceCompanyController.bulkTpaCompanyImport
);

// Insurance Company routes

insuranceCompnayMasterRouter.get(
  "/",
  handleToken,
  InsuranceCompanyController.getInsuranceCompany
);
insuranceCompnayMasterRouter.post(
  "/",
  handleToken,
  InsuranceCompanyController.addInsuranceCompany
);
insuranceCompnayMasterRouter.put(
  "/:id",
  handleToken,
  InsuranceCompanyController.updateInsuranceCompany
);
insuranceCompnayMasterRouter.put(
  "/delete/:id",
  handleToken,
  InsuranceCompanyController.deleteInsuranceCompany
);
insuranceCompnayMasterRouter.post(
  "/import",
  handleToken,
  InsuranceCompanyController.bulkInsuranceCompanyImport
);

// Goverment Company routes

insuranceCompnayMasterRouter.get(
  "/gov",
  handleToken,
  InsuranceCompanyController.getGovermentCompany
);
insuranceCompnayMasterRouter.post(
  "/gov",
  handleToken,
  InsuranceCompanyController.addGovermentCompany
);
insuranceCompnayMasterRouter.put(
  "/gov/:id",
  handleToken,
  InsuranceCompanyController.updateGovermentCompany
);
insuranceCompnayMasterRouter.put(
  "/gov/delete/:id",
  handleToken,
  InsuranceCompanyController.deleteGovermentCompany
);
insuranceCompnayMasterRouter.post(
  "/gov/import",
  handleToken,
  InsuranceCompanyController.bulkGovermentCompanyImport
);

// Co-Operative Company
insuranceCompnayMasterRouter.get(
  "/co-operative",
  handleToken,
  InsuranceCompanyController.getCooperativeCompany
);
insuranceCompnayMasterRouter.post(
  "/co-operative",
  handleToken,
  InsuranceCompanyController.addCooperativeCompany
);
insuranceCompnayMasterRouter.put(
  "/co-operative/:id",
  handleToken,
  InsuranceCompanyController.updateCooperativeCompany
);
insuranceCompnayMasterRouter.put(
  "/co-operative/delete/:id",
  handleToken,
  InsuranceCompanyController.deleteCooperativeCompany
);
insuranceCompnayMasterRouter.post(
  "/co-operative/import",
  handleToken,
  InsuranceCompanyController.bulkCooperativeCompanyImport
);

// Cooperative company Privte
insuranceCompnayMasterRouter.get(
  "/co-operative-private",
  handleToken,
  InsuranceCompanyController.getCooperativeCompanyPrivate
);
insuranceCompnayMasterRouter.post(
  "/co-operative-private",
  handleToken,
  InsuranceCompanyController.addCooperativeCompanyPrivate
);
insuranceCompnayMasterRouter.put(
  "/co-operative-private/:id",
  handleToken,
  InsuranceCompanyController.updateCooperativeCompanyPrivate
);
insuranceCompnayMasterRouter.put(
  "/co-operative-private/delete/:id",
  handleToken,
  InsuranceCompanyController.deleteCooperativeCompanyPrivate
);
insuranceCompnayMasterRouter.post(
  "/co-operative-private/import",
  handleToken,
  InsuranceCompanyController.bulkCooperativeCompanyImportPrivate
);

module.exports = insuranceCompnayMasterRouter;
