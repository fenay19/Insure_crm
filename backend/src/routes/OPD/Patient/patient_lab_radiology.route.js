const express = require("express");
const PatientLabRadiologyRoutes = express.Router();
const {PatientLabRadiologyController} = require("../../../controllers");
const {handleToken} = require('../../../utils/handleToken');

PatientLabRadiologyRoutes.post('/',handleToken,PatientLabRadiologyController.createPatientLabRadiology);
PatientLabRadiologyRoutes.put('/:id',handleToken,PatientLabRadiologyController.updatePatientLabRadiology);
PatientLabRadiologyRoutes.get('/:id',handleToken,PatientLabRadiologyController.getAllPatientLabRadiology);
PatientLabRadiologyRoutes.put('/delete/:id',handleToken,PatientLabRadiologyController.deleteLabRadiologyEntry);

module.exports = PatientLabRadiologyRoutes