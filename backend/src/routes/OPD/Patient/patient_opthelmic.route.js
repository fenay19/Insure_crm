const express = require("express");
const PatientOpthelmic = express.Router();
const PatientOpthelmicController = require("../../../controllers/OPD/Patient/patient_opthalmic.controller");
const { handleToken } = require("../../../utils/handleToken");

PatientOpthelmic.post(
  "/vision",
  handleToken,
  PatientOpthelmicController.createVision
);
PatientOpthelmic.put(
  "/vision/:id",
  handleToken,
  PatientOpthelmicController.updateVision
);

PatientOpthelmic.post(
  "/findings",
  handleToken,
  PatientOpthelmicController.createFindings
);
PatientOpthelmic.put(
  "/findings/:id",
  handleToken,
  PatientOpthelmicController.updateFindings
);
PatientOpthelmic.post(
  "/auto-refraction",
  handleToken,
  PatientOpthelmicController.createAutoRefraction
);
PatientOpthelmic.post(
  "/auto-refraction-dilated",
  handleToken,
  PatientOpthelmicController.createAutoRefractionDilated
);
PatientOpthelmic.put(
  "/auto-refraction/:id",
  handleToken,
  PatientOpthelmicController.updateAutoRefraction
);
PatientOpthelmic.put(
  "/auto-refraction-dilated/:id",
  handleToken,
  PatientOpthelmicController.updateAutoRefractionDilated
);

PatientOpthelmic.get(
  "/:patientId",
  handleToken,
  PatientOpthelmicController.getPatientOpthalmic
);
PatientOpthelmic.delete(
  "/:patientId/:type/:id",
  handleToken,
  PatientOpthelmicController.deletePatientOpthalmic
);
PatientOpthelmic.put(
  "/update/:patientId/:type/:id",
  handleToken,
  PatientOpthelmicController.updatePatientOpthalmicInner
);

module.exports = PatientOpthelmic;
