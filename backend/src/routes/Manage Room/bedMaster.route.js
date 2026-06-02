const express = require('express');
const bedMasterRouter = express.Router();
const { bedMasterController } = require('../../controllers');
// const { validateBedMaster } = require('../../validations/Manage Room/bedMaster.validation');
const {handleToken} = require('../../utils/handleToken'); 

bedMasterRouter.post('/', handleToken, bedMasterController.createBedMaster);

bedMasterRouter.get('/', handleToken, bedMasterController.getAllBedMaster);

bedMasterRouter.get('/:id', handleToken, bedMasterController.getBedMasterById);

bedMasterRouter.put('/:id', handleToken, bedMasterController.updateBedMasterById);

bedMasterRouter.put('/delete/:id', handleToken, bedMasterController.deleteBedMasterById);

module.exports = bedMasterRouter;
