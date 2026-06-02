const express = require("express");
const PatientDiagnosticsRoutes = express.Router();
const PatientDiagnosticsController = require("../../../controllers/OPD/Patient/patient_diagnostics.controller");
const { handleToken } = require("../../../utils/handleToken");

PatientDiagnosticsRoutes.post(
  "/",
  handleToken,
  PatientDiagnosticsController.createDiagnostic
);
PatientDiagnosticsRoutes.put(
  "/:id",
  handleToken,
  PatientDiagnosticsController.updateDiagnostic
);
PatientDiagnosticsRoutes.get(
  "/:id",
  handleToken,
  PatientDiagnosticsController.getDiagnosticById
);
PatientDiagnosticsRoutes.get(
  "/diagnostics/:consultantId/:opdPatientId",
  handleToken,
  PatientDiagnosticsController.getAllDiagnostics
);

module.exports = PatientDiagnosticsRoutes;
