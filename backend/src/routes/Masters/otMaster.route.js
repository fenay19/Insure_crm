const express = require('express');
const otMasterRouter = express.Router();
const { OtMasterController } = require('../../controllers');
const {handleToken} = require('../../utils/handleToken'); 

otMasterRouter.post('/', handleToken, OtMasterController.createOtMaster);
otMasterRouter.get('/', handleToken,OtMasterController.getAllOtMaster);
otMasterRouter.put('/:id', handleToken,OtMasterController.updatOtMasterById);
otMasterRouter.put('/delete/:id', handleToken,OtMasterController.deleteOtMasterById);


module.exports = otMasterRouter;