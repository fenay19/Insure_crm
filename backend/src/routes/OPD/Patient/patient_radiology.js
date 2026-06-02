const express = require("express");
const PatientRadiologyRoutes = express.Router();
const PatientRadiologyController = require("../../../controllers/OPD/Patient/patient_radiology");
const { handleToken } = require("../../../utils/handleToken");

PatientRadiologyRoutes.post(
  "/",
  handleToken,
  PatientRadiologyController.createRadiology
);
PatientRadiologyRoutes.put(
  "/:id",
  handleToken,
  PatientRadiologyController.updateRadiology
);
PatientRadiologyRoutes.get(
  "/:id",
  handleToken,
  PatientRadiologyController.getRadiologyById
);
PatientRadiologyRoutes.get(
  "/radiologies/:consultantId/:opdPatientId",
  handleToken,
  PatientRadiologyController.getAllRadiologies
);

module.exports = PatientRadiologyRoutes;
