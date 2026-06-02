const express = require("express");
const PatientPathologyRoutes = express.Router();
const PatientPathologyController = require("../../../controllers/OPD/Patient/patient_pathology");
const { handleToken } = require("../../../utils/handleToken");

PatientPathologyRoutes.post(
  "/",
  handleToken,
  PatientPathologyController.createPathology
);
PatientPathologyRoutes.put(
  "/:id",
  handleToken,
  PatientPathologyController.updatePathology
);
PatientPathologyRoutes.get(
  "/:id",
  handleToken,
  PatientPathologyController.getPathologyById
);
PatientPathologyRoutes.get(
  "/pathologies/:consultantId/:opdPatientId",
  handleToken,
  PatientPathologyController.getAllPathologies
);

module.exports = PatientPathologyRoutes;
