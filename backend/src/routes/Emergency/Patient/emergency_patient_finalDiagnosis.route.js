const express = require('express');
const {
    createPatientFinalDiagnosis,
    updatePatientFinalDiagnosis,
    getAllPatientFinalDiagnosis,
  } = require("../../../controllers/Emergency/Patient/emergency_patient_finalDiagnosis.controller");
const EmergencyPatientFinalDiagnosisRoutes = express.Router();
const {handleToken} = require('../../../utils/handleToken');

EmergencyPatientFinalDiagnosisRoutes.post('/',handleToken,createPatientFinalDiagnosis);
EmergencyPatientFinalDiagnosisRoutes.put('/:id',handleToken,updatePatientFinalDiagnosis);
EmergencyPatientFinalDiagnosisRoutes.get('/:id',handleToken,getAllPatientFinalDiagnosis);

module.exports = EmergencyPatientFinalDiagnosisRoutes