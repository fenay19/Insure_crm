const express = require('express');
const specimenRadiologyMaster = express.Router();
const { specimenRadiologyMasterController } = require('../../../controllers');
const {handleToken} = require('../../../utils/handleToken'); 

specimenRadiologyMaster.post('/', handleToken,specimenRadiologyMasterController.addSpecimen);

specimenRadiologyMaster.post('/import', handleToken,specimenRadiologyMasterController.bulkImport);

specimenRadiologyMaster.get('/', handleToken,specimenRadiologyMasterController.getAllSpecimen);

specimenRadiologyMaster.get('/:id', handleToken,specimenRadiologyMasterController.getSingleSpecimen);

specimenRadiologyMaster.put('/:id', handleToken,specimenRadiologyMasterController.editSpecimen);

specimenRadiologyMaster.put('/delete/:id', handleToken,specimenRadiologyMasterController.deleteSpecimen);

module.exports = specimenRadiologyMaster