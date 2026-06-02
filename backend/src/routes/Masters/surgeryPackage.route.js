const express = require("express");
const surgeryPackageDetailsMasterRouter = express.Router();
const { surgeryPackageController } = require("../../controllers");
const { validatesurgeryPackageMaster } = require("../../validations/Masters/surgeryPackage.validations");
const {handleToken} = require('../../utils/handleToken'); 


surgeryPackageDetailsMasterRouter.get("/", handleToken, surgeryPackageController.getAllSurgeryPackages);

surgeryPackageDetailsMasterRouter.post("/", handleToken, validatesurgeryPackageMaster, surgeryPackageController.addSurgeryPackage);

surgeryPackageDetailsMasterRouter.put("/:id", handleToken, surgeryPackageController.editSurgeryPackage);

surgeryPackageDetailsMasterRouter.put("/delete/:id", handleToken, surgeryPackageController.deleteSurgeryPackage);

surgeryPackageDetailsMasterRouter.post("/import", handleToken, surgeryPackageController.bulkImport);

surgeryPackageDetailsMasterRouter.post("/dept/:id", handleToken, surgeryPackageController.getAllSurgeryPackagesByDeptId);


module.exports = surgeryPackageDetailsMasterRouter;