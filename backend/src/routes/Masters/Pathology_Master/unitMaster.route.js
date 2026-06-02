const express = require('express');
const unitMasterRouter = express.Router();
const { unitController } = require('../../../controllers');
const {handleToken} = require('../../../utils/handleToken'); 

unitMasterRouter.post('/', handleToken,unitController.createUnit);

unitMasterRouter.post('/import', handleToken,unitController.bulkImport);

unitMasterRouter.get('/', handleToken,unitController.getAllUnits);

unitMasterRouter.get('/:id', handleToken,unitController.getUnitById);

unitMasterRouter.put('/:id', handleToken,unitController.updateUnitById);

unitMasterRouter.put('/delete/:id', handleToken,unitController.deleteUnitById);

module.exports = unitMasterRouter;
