const express = require('express');
const patientRouter = express.Router();
const { patientController } = require('../../controllers');
const { validatePatient } = require('../../validations/Patient/patient.validation');
const {handleToken} = require('../../utils/handleToken'); 

patientRouter.post("/", handleToken, validatePatient, patientController.createPatient),
patientRouter.get("/", handleToken, patientController.getAllPatients),
patientRouter.put("/:id", handleToken, patientController.updatePatient),
patientRouter.get('/:id', handleToken, patientController.getPatientById);
patientRouter.put("/delete/:id", handleToken, patientController.deletePatient),

module.exports = patientRouter