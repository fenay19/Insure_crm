const express = require('express');
const PatientPresentIllnessRoutes = express.Router();
const {PatientPresentIllnessController} = require('../../../controllers');
const {handleToken} = require('../../../utils/handleToken');

PatientPresentIllnessRoutes.post('/',handleToken,PatientPresentIllnessController.createPatientPresentIllnessHistory);
PatientPresentIllnessRoutes.put('/:id',handleToken,PatientPresentIllnessController.updatePatientPresentIllnessHistory);
PatientPresentIllnessRoutes.get('/:id',handleToken,PatientPresentIllnessController.getAllPatientPresentIllnessHistory);

module.exports = PatientPresentIllnessRoutes