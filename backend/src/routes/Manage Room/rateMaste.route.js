const express = require('express');
const rateMasterRouter = express.Router();
const { rateMasterController } = require('../../controllers');
// const { validateBedMaster } = require('../../validations/Manage Room/bedMaster.validation');
const {handleToken} = require('../../utils/handleToken'); 

rateMasterRouter.post('/', handleToken, rateMasterController.createRateMaster);

rateMasterRouter.get('/', handleToken, rateMasterController.getAllRateMaster);

rateMasterRouter.get('/:id', handleToken, rateMasterController.getRateMasterById);

rateMasterRouter.put('/:id', handleToken, rateMasterController.updateRateMasterById);

rateMasterRouter.put('/delete/:id', handleToken, rateMasterController.deleteRateMasterById);

module.exports = rateMasterRouter;
