const express = require('express');
const specimenMasterRouter = express.Router()
const { specimenController } = require('../../../controllers')
const {handleToken} = require('../../../utils/handleToken'); 

specimenMasterRouter.get('/', handleToken,specimenController.getAllSpecimen);

specimenMasterRouter.post('/', handleToken,specimenController.createSpecimen);

specimenMasterRouter.post('/import', handleToken,specimenController.bulkImport);

specimenMasterRouter.put('/:id', handleToken,specimenController.updateSpecimen);

specimenMasterRouter.put('/delete/:id', handleToken,specimenController.deleteSpecimen);

module.exports = specimenMasterRouter