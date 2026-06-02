const express = require("express");
const formSetupVitalMaster = express.Router();
const {
  createPatientVital,
  getAllPatientVitals,
  deletePatientVital,
  updatePatientVital,
  getPatientVitalById,
  updateSingleEntries,
} = require("../../../controllers/Masters/formSetup/formSetupVitalMaster.controller");
const { handleToken } = require("../../../utils/handleToken");

formSetupVitalMaster.post("/", handleToken, createPatientVital);
// formSetupVitalMaster.get("/get", handleToken, getAllVitals);
formSetupVitalMaster.get("/get/:patientId", handleToken, getPatientVitalById);
formSetupVitalMaster.delete(
  "/delete/:patientId/:vitalId",
  handleToken,
  deletePatientVital
);
formSetupVitalMaster.put("/update/:patientId", handleToken, updatePatientVital);
formSetupVitalMaster.put(
  "/update-single/:patientId/:vitalId",
  handleToken,
  updateSingleEntries
);

module.exports = formSetupVitalMaster;
