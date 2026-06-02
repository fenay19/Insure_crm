const express = require('express');
const {PatientFinalDiagnosisController} = require("../../../controllers");
const PatientFinalDiagnosisRoutes = express.Router();
const {handleToken} = require('../../../utils/handleToken');

PatientFinalDiagnosisRoutes.post('/',handleToken,PatientFinalDiagnosisController.createPatientFinalDiagnosis);
PatientFinalDiagnosisRoutes.put('/:id',handleToken,PatientFinalDiagnosisController.updatePatientFinalDiagnosis);
PatientFinalDiagnosisRoutes.get('/:id',handleToken,PatientFinalDiagnosisController.getAllPatientFinalDiagnosis);
PatientFinalDiagnosisRoutes.get('/final-diagnosis/:consultantId/:opdPatientId',PatientFinalDiagnosisController.getPatientFinalDiagnosis);

module.exports = PatientFinalDiagnosisRoutes