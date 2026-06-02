const express = require("express");
const InvestigationPathologyMasterRoute = express.Router();
const { InvestigationPathologyMasterController } = require('../../../controllers');
const { validateInvestigationPathologyMaster } = require("../../../validations/Masters/Pathology_Master/investigationRadiologyMaster.validations");
const {handleToken} = require('../../../utils/handleToken'); 

InvestigationPathologyMasterRoute.get('/', handleToken,InvestigationPathologyMasterController.getAllInvestigation);

InvestigationPathologyMasterRoute.post('/', handleToken,InvestigationPathologyMasterController.addInvestigation);

InvestigationPathologyMasterRoute.put('/:id', handleToken,InvestigationPathologyMasterController.editInvestigation);
InvestigationPathologyMasterRoute.put('/update-rate/:id', handleToken,InvestigationPathologyMasterController.updateInvestigationRateAndCode);

InvestigationPathologyMasterRoute.put('/delete/:id', handleToken,InvestigationPathologyMasterController.deleteInvestigation);

InvestigationPathologyMasterRoute.post('/import', handleToken,InvestigationPathologyMasterController.importTests);



//routes for profile master

InvestigationPathologyMasterRoute.post('/profile', InvestigationPathologyMasterController.createProfile);
InvestigationPathologyMasterRoute.put('/profile/:id', InvestigationPathologyMasterController.editProfileById);
InvestigationPathologyMasterRoute.get('/profile', InvestigationPathologyMasterController.getAllProfile);
InvestigationPathologyMasterRoute.put('/profile/delete/:id', InvestigationPathologyMasterController.deleteProfileById);



InvestigationPathologyMasterRoute.put('/add/:id/:paramId', handleToken,InvestigationPathologyMasterController.addThirdInvestigation);
InvestigationPathologyMasterRoute.put('/edit/:id/:paramId/:thirdParamId', handleToken,InvestigationPathologyMasterController.editThirdInvestigation);


InvestigationPathologyMasterRoute.put('/delete/:id/:paramId/:thirdParamId', handleToken,InvestigationPathologyMasterController.deleteThirdInvestigation);

module.exports = InvestigationPathologyMasterRoute