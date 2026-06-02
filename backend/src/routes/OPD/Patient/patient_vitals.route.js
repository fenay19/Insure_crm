const express = require("express");
const {PatientVitalsController} = require("../../../controllers");
const PatientVitalsRoutes = express.Router();
const {handleToken} = require('../../../utils/handleToken');

PatientVitalsRoutes.post('/',handleToken,PatientVitalsController.createPatientVitals);
PatientVitalsRoutes.get('/:id',handleToken,PatientVitalsController.getAllPatientVitals);
PatientVitalsRoutes.put('/update/:id',handleToken,PatientVitalsController.updatePatientVitals);
PatientVitalsRoutes.post('/date-wise/:id',handleToken,PatientVitalsController.getDateWisePatientVitals);

module.exports = PatientVitalsRoutes