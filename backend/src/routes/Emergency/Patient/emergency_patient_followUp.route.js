const express = require('express');
const {
    createPatientFollowUp,
    updatePatientFollowUp,
    getAllPatientFollowUp
} = require("../../../controllers/Emergency/Patient/emergency_patient_followUp.controller");
const EmergencyPatientFollowUpRoutes = express.Router();
const {handleToken} = require('../../../utils/handleToken');

EmergencyPatientFollowUpRoutes.post('/',handleToken,createPatientFollowUp);
EmergencyPatientFollowUpRoutes.get('/:id',handleToken,getAllPatientFollowUp);
EmergencyPatientFollowUpRoutes.put('/:id',handleToken,updatePatientFollowUp);

module.exports = EmergencyPatientFollowUpRoutes