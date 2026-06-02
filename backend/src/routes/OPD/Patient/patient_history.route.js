const express = require('express');
const PatientHistoryRouter = express.Router();
const {PatientHistoryController} = require('../../../controllers');
const {handleToken} = require('../../../utils/handleToken'); 

PatientHistoryRouter.post('/',handleToken,PatientHistoryController.createPatientHistory);
PatientHistoryRouter.put('/:id',handleToken,PatientHistoryController.updatePatientHistory);
PatientHistoryRouter.get('/:id',handleToken,PatientHistoryController.getAllPatientHistory);
PatientHistoryRouter.get('/history/:consultantId/:opdPatientId',handleToken,PatientHistoryController.getPatientHistoryByConsultantAndPatient);

module.exports = PatientHistoryRouter