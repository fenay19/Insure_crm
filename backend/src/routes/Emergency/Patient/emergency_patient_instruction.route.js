const express = require("express");
const {
    createPatientInstruction,
    updatePatientInstruction,
    getAllPatientInstruction
} = require("../../../controllers/Emergency/Patient/emergency_patient_instruction.controller");
const EmergencyPatientInstructionRoutes = express.Router();
const {handleToken} = require('../../../utils/handleToken');

EmergencyPatientInstructionRoutes.post('/',handleToken,createPatientInstruction);
EmergencyPatientInstructionRoutes.put('/:id',handleToken,updatePatientInstruction);
EmergencyPatientInstructionRoutes.get('/:id',handleToken,getAllPatientInstruction);

module.exports = EmergencyPatientInstructionRoutes