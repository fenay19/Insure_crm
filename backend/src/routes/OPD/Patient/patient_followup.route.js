const express = require('express');
const {PatientFollowUpController} = require("../../../controllers");
const PatientFollowUpRoutes = express.Router();
const {handleToken} = require('../../../utils/handleToken');

PatientFollowUpRoutes.post('/',handleToken,PatientFollowUpController.createPatientFollowUp);
PatientFollowUpRoutes.get('/:id',handleToken,PatientFollowUpController.getAllPatientFollowUp);
PatientFollowUpRoutes.put('/:id',handleToken,PatientFollowUpController.updatePatientFollowUp);
PatientFollowUpRoutes.get('/followup/:consultantId/:opdPatientId',PatientFollowUpController.getPatientFollowUpDate);
PatientFollowUpRoutes.delete('/:id',PatientFollowUpController.deleteFollowUpById);

module.exports = PatientFollowUpRoutes