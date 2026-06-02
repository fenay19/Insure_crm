const express = require("express");
const PatientMedicalPrescriptionRoutes = express.Router();
const {
  createPatientMedicalPrescription,
  updatePatientMedicalPrescription,
  getAllPatientMedicalPrescription,
  getOldPrescription,
} = require("../../../controllers/OPD/Patient/patient_medical_prescription.controller");
const { handleToken } = require("../../../utils/handleToken");

PatientMedicalPrescriptionRoutes.post(
  "/",
  handleToken,
  createPatientMedicalPrescription
);
PatientMedicalPrescriptionRoutes.put(
  "/:id",
  handleToken,
  updatePatientMedicalPrescription
);
PatientMedicalPrescriptionRoutes.get(
  "/:id",
  handleToken,
  getAllPatientMedicalPrescription
);
PatientMedicalPrescriptionRoutes.get(
  "/old-prescription/:patientId/:consultantId",
  handleToken,
  getOldPrescription
);

module.exports = PatientMedicalPrescriptionRoutes;
