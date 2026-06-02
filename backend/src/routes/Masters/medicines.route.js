const express = require("express");
const medicinesRouter = express.Router();
const { MedicinesMasterController } = require("../../controllers");
const {handleToken} = require('../../utils/handleToken'); 

medicinesRouter.get("/", handleToken, MedicinesMasterController.getAllMedicines);
medicinesRouter.post("/", handleToken, MedicinesMasterController.addMedicines);
medicinesRouter.put("/:id", handleToken, MedicinesMasterController.updateMedicinesById);
medicinesRouter.get("/most-used", handleToken, MedicinesMasterController.GetMostMedicinesByIds);
medicinesRouter.delete("/", handleToken, MedicinesMasterController.deleteMedicinesByIds);
medicinesRouter.post("/import", handleToken, MedicinesMasterController.importJson);

module.exports = medicinesRouter;
