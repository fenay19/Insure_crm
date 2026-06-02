const express = require('express');
const {
    createPatientProvisionalDiagnosis,
    updatePatientProvisionalDiagnosis,
    getAllPatientProvisionalDiagnosis,
  } = require("../../../controllers/Emergency/Patient/emergency_patient_provisional_diagnosis.controller");
const EmergencyPatientProvisionalDiagnosisRoutes = express.Router();
const {handleToken} = require('../../../utils/handleToken');

EmergencyPatientProvisionalDiagnosisRoutes.post('/',handleToken,createPatientProvisionalDiagnosis);
EmergencyPatientProvisionalDiagnosisRoutes.put('/:id',handleToken,updatePatientProvisionalDiagnosis);
EmergencyPatientProvisionalDiagnosisRoutes.get('/:id',handleToken,getAllPatientProvisionalDiagnosis);

module.exports = EmergencyPatientProvisionalDiagnosisRoutes;