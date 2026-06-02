const express = require('express');
const outsourceDiagnosticRouter = express.Router();
const { outsourceDiagnosticontroller } = require('../../controllers');
const { validateOutsourceDiagnostics } = require("../../validations/Masters/outsourceDiagnostic.validation");
const {handleToken} = require('../../utils/handleToken'); 

outsourceDiagnosticRouter.post('/', handleToken, outsourceDiagnosticontroller.createOutsourceDiagnostic);
outsourceDiagnosticRouter.get('/', handleToken,outsourceDiagnosticontroller.getAllOutsourceDiagnostic);
outsourceDiagnosticRouter.get('/:id', handleToken,outsourceDiagnosticontroller.getOutsourceDiagnosticById);
outsourceDiagnosticRouter.put('/:id',handleToken,outsourceDiagnosticontroller.updateOutsourceDiagnosticById);
outsourceDiagnosticRouter.put('/delete/:id', handleToken,outsourceDiagnosticontroller.deleteOutsourceDiagnosticById);

outsourceDiagnosticRouter.put('/param/:id', handleToken,outsourceDiagnosticontroller.addParamOutsourceDiagnosticById);
outsourceDiagnosticRouter.put('/param/:id/:paramId', handleToken,outsourceDiagnosticontroller.updateParamOutsourceDiagnosticById);
outsourceDiagnosticRouter.put('/param/delete/:id/:paramId', handleToken,outsourceDiagnosticontroller.deleteParamOutsourceDiagnosticById);

outsourceDiagnosticRouter.post('/import', handleToken,outsourceDiagnosticontroller.bulkImport);

module.exports = outsourceDiagnosticRouter;