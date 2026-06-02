const express = require("express");
const { PatientGlassPrescriptionController } = require("../../../controllers");
const PatientGlassPrescriptionRoutes = express.Router();
const { handleToken } = require("../../../utils/handleToken");

// Glass Prescription Routes
PatientGlassPrescriptionRoutes.post(
  "/",
  handleToken,
  PatientGlassPrescriptionController.createPatientGlassPrescription
);
PatientGlassPrescriptionRoutes.get(
  "/:id",
  handleToken,
  PatientGlassPrescriptionController.getAllPatientGlassPrescription
);
PatientGlassPrescriptionRoutes.put(
  "/:patientId/:eyeId",
  handleToken,
  PatientGlassPrescriptionController.updatePatientGlassPrescription
);
PatientGlassPrescriptionRoutes.delete(
  "/:prescriptionId/:eyeId",
  handleToken,
  PatientGlassPrescriptionController.deletePatientGlassPrescription
);

// Remark
// add
PatientGlassPrescriptionRoutes.post(
  "/remark",
  handleToken,
  PatientGlassPrescriptionController.addPatientRemark
);
// Get
PatientGlassPrescriptionRoutes.get(
  "/remark/:id",
  handleToken,
  PatientGlassPrescriptionController.getPatientRemarkById
);
PatientGlassPrescriptionRoutes.put(
  "/remark-update/:id",
  handleToken,
  PatientGlassPrescriptionController.updatePatientRemark
);

module.exports = PatientGlassPrescriptionRoutes;
