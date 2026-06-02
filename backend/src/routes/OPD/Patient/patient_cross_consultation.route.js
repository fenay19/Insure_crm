const express = require("express");
const patientCrossConsultationRoutes = express.Router();
const patientCrossConsultationController = require("../../../controllers/OPD/Patient/patient_cross_consultation.controller");

const { handleToken } = require("../../../utils/handleToken");
patientCrossConsultationRoutes.post(
  "/",
  handleToken,
  patientCrossConsultationController.createPatientCrossConsultation
);
patientCrossConsultationRoutes.put(
  "/edit/:id",
  handleToken,
  patientCrossConsultationController.editPatientCrossConsultation
);
patientCrossConsultationRoutes.get(
  "/get/:id",
  handleToken,
  patientCrossConsultationController.getPatientCrossConsultation
);
patientCrossConsultationRoutes.delete(
  "/delete/:id",
  handleToken,
  patientCrossConsultationController.deletePatientCrossConsultation
);

module.exports = patientCrossConsultationRoutes;
