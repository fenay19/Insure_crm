const express = require("express");
const PatientChiefComplaintRoutes = express.Router();
const { PatientChiefComplaintController } = require("../../../controllers");
const { handleToken } = require("../../../utils/handleToken");

PatientChiefComplaintRoutes.post(
  "/:departmentId",
  handleToken,
  PatientChiefComplaintController.createPatientChiefComplaint
);
PatientChiefComplaintRoutes.put(
  "/:patientId",
  handleToken,
  PatientChiefComplaintController.updatePatientChiefComplaint
);
PatientChiefComplaintRoutes.get(
  "/:id",
  handleToken,
  PatientChiefComplaintController.getAllPatientChiefComplaint
);
PatientChiefComplaintRoutes.get(
  "/getPatientChiefComplaint/:patientId",
  handleToken,
  PatientChiefComplaintController.getPatientChiefComplaint
);

PatientChiefComplaintRoutes.get(
  "/chiefComplainByConsultantAndPatient/:consultantId/:opdPatientId",
  handleToken,
  PatientChiefComplaintController.getPatientChiefComplaintByPatientAndConsultant
);

PatientChiefComplaintRoutes.delete(
  "/:id",
  handleToken,
  PatientChiefComplaintController.deletePainChiefComplaint
);

module.exports = PatientChiefComplaintRoutes;
