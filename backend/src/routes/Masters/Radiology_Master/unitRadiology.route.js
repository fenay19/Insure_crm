const express = require('express');
const unitRadiologyMasterRouter = express.Router();
const { unitRadiologyController } = require('../../../controllers');
const {handleToken} = require('../../../utils/handleToken'); 


unitRadiologyMasterRouter.post('/', handleToken, unitRadiologyController.createUnit);

unitRadiologyMasterRouter.post('/import', handleToken, unitRadiologyController.bulkImport);

unitRadiologyMasterRouter.get('/', handleToken,unitRadiologyController.getAllUnits);

unitRadiologyMasterRouter.get('/:id', handleToken,unitRadiologyController.getUnitById);

unitRadiologyMasterRouter.put('/:id', handleToken,unitRadiologyController.updateUnitById);

unitRadiologyMasterRouter.put('/delete/:id', handleToken,unitRadiologyController.deleteUnitById);

module.exports = unitRadiologyMasterRouter;
