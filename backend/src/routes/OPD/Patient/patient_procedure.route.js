const express = require("express");
const PatientProcedureRoutes = express.Router();
const {PatientProcedureController} = require("../../../controllers");
const {handleToken} = require('../../../utils/handleToken');

PatientProcedureRoutes.post('/',handleToken,PatientProcedureController.createPatientProcedure);
PatientProcedureRoutes.put('/:id',handleToken,PatientProcedureController.updatePatientProcedure);
PatientProcedureRoutes.get('/:id',handleToken,PatientProcedureController.getAllPatientProcedure);
PatientProcedureRoutes.get('/procedure/:consultantId/:opdPatientId',handleToken,PatientProcedureController.getPatientProcedures);

module.exports = PatientProcedureRoutes