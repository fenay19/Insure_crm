const express = require("express");
const machineRadiologyMasterRoute = express.Router();
const { machineRadiologyMasterController } = require('../../../controllers');
const { validateMachineRadiologyMaster } = require("../../../validations/Masters/Radiology_Master/machineRadiologyMaster.validations");
const {handleToken} = require('../../../utils/handleToken'); 

machineRadiologyMasterRoute.get('/', handleToken,machineRadiologyMasterController.getAllMachine);

machineRadiologyMasterRoute.post('/', handleToken,validateMachineRadiologyMaster, machineRadiologyMasterController.addMachine);

machineRadiologyMasterRoute.post('/import', handleToken, machineRadiologyMasterController.bulkImport);

machineRadiologyMasterRoute.get('/:id', handleToken,machineRadiologyMasterController.getSingleMachine);

machineRadiologyMasterRoute.put('/:id', handleToken,machineRadiologyMasterController.editMachine);

machineRadiologyMasterRoute.put('/delete/:id', handleToken,machineRadiologyMasterController.deleteMachine);

module.exports = machineRadiologyMasterRoute