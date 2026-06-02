const express = require('express');
const machineMasterRouter = express.Router();
const { machineController } = require('../../../controllers');
const { validateMachineMaster } = require('../../../validations/Masters/Pathology_Master/machineMaster.validation');
const {handleToken} = require('../../../utils/handleToken'); 

machineMasterRouter.post('/', handleToken,validateMachineMaster, machineController.createMachine);

machineMasterRouter.post('/import', handleToken, machineController.bulkImport);

machineMasterRouter.get('/', handleToken,machineController.getAllMachine);

machineMasterRouter.get('/:id', handleToken,machineController.getMachineById);

machineMasterRouter.put('/:id', handleToken,machineController.updateMachineById);

machineMasterRouter.put('/delete/:id', handleToken,machineController.deleteMachineById);

module.exports = machineMasterRouter;
