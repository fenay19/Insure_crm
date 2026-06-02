const express = require("express");
const {
  PatientProvisionalDiagnosisController,
} = require("../../../controllers");
const PatientProvisionalDiagnosisRoutes = express.Router();
const { handleToken } = require("../../../utils/handleToken");

PatientProvisionalDiagnosisRoutes.post(
  "/",
  handleToken,
  PatientProvisionalDiagnosisController.createPatientProvisionalDiagnosis
);
PatientProvisionalDiagnosisRoutes.put(
  "/:id",
  handleToken,
  PatientProvisionalDiagnosisController.updatePatientProvisionalDiagnosis
);
PatientProvisionalDiagnosisRoutes.get(
  "/:id",
  handleToken,
  PatientProvisionalDiagnosisController.getAllPatientProvisionalDiagnosis
);
PatientProvisionalDiagnosisRoutes.get(
  "/get/:id",
  handleToken,
  PatientProvisionalDiagnosisController.getAllPatientProvisionalDiagnosisById
);


PatientProvisionalDiagnosisRoutes.get('/diagnosis/:consultantId/:opdPatientId', PatientProvisionalDiagnosisController.getPatientProvisionalDiagnosis)

module.exports = PatientProvisionalDiagnosisRoutes;
