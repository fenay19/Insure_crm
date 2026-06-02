const express = require("express");
const EmergencyPatientProcedureRoutes = express.Router();
const {
    createPatientProcedure,
    updatePatientProcedure,
    getAllPatientProcedure
} = require("../../../controllers/Emergency/Patient/emergency_patient_procedure.controller");
const {handleToken} = require('../../../utils/handleToken');

EmergencyPatientProcedureRoutes.post('/',handleToken,createPatientProcedure);
EmergencyPatientProcedureRoutes.put('/:id',handleToken,updatePatientProcedure);
EmergencyPatientProcedureRoutes.get('/:id',handleToken,getAllPatientProcedure);

module.exports = EmergencyPatientProcedureRoutes