const express = require("express");
const {PatientInstructionController} = require("../../../controllers");
const PatientInstructionRoutes = express.Router();
const {handleToken} = require('../../../utils/handleToken');

PatientInstructionRoutes.post('/',handleToken,PatientInstructionController.createPatientInstruction);
PatientInstructionRoutes.put('/:id',handleToken,PatientInstructionController.updatePatientInstruction);
PatientInstructionRoutes.get('/:id',handleToken,PatientInstructionController.getAllPatientInstruction);

module.exports = PatientInstructionRoutes