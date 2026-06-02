const express = require("express");
const serviceDetailsMasterRouter = express.Router();
const { serviceDetailsController } = require("../../controllers");
const { validateserviceDetailsMaster } = require("../../validations/Masters/serviceDetails.validations");
const {handleToken} = require('../../utils/handleToken'); 

serviceDetailsMasterRouter.get("/", handleToken,serviceDetailsController.getAllServiceDetails);

serviceDetailsMasterRouter.post("/", handleToken, validateserviceDetailsMaster, serviceDetailsController.addServiceDetails);

serviceDetailsMasterRouter.post("/import", handleToken, serviceDetailsController.bulkImport);

serviceDetailsMasterRouter.put("/:id", handleToken, serviceDetailsController.editServiceDetails);
serviceDetailsMasterRouter.put("/update-rate/:id", handleToken, serviceDetailsController.updateServiceDetailRateAndCode);

serviceDetailsMasterRouter.put("/delete/:id", handleToken, serviceDetailsController.deleteServiceDetails);

serviceDetailsMasterRouter.put("/update-rate/:id", handleToken, serviceDetailsController.updateServiceRate);

module.exports = serviceDetailsMasterRouter;