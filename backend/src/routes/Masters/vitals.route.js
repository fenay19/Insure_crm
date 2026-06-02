const express = require("express");
const vitalsRouter = express.Router();
const { VitalsMasterController } = require("../../controllers");
const {handleToken} = require('../../utils/handleToken'); 

vitalsRouter.get("/", handleToken, VitalsMasterController.getAllVitals);
vitalsRouter.post("/", handleToken, VitalsMasterController.addvitals);
vitalsRouter.put("/:id", handleToken, VitalsMasterController.updateVitalsById);
vitalsRouter.delete("/", handleToken, VitalsMasterController.deleteVitalsByIds);

module.exports = vitalsRouter;
