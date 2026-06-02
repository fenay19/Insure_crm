const express = require('express');
const charityRouter = express.Router();
const { charityController } = require("../../controllers");
const {handleToken} = require('../../utils/handleToken'); 

// Parent Group
charityRouter.post('/parent-group', handleToken, charityController.addParentGroup);
charityRouter.get('/parent-group', handleToken,charityController.getAllParentGroup);
charityRouter.put('/parent-group/:id', handleToken,charityController.updateParentGroupById);
charityRouter.put('/parent-group/delete/:id', handleToken,charityController.deleteParentGroupById);
charityRouter.post('/parent-group/import', handleToken, charityController.importParentGroup);


// Payee Group
charityRouter.post('/payee-group', handleToken, charityController.addPayeeParentGroup);
charityRouter.get('/payee-group', handleToken,charityController.getAllPayeeParentGroup);
charityRouter.put('/payee-group/:id', handleToken,charityController.updatePayeeParentGroupById);
charityRouter.put('/payee-group/delete/:id', handleToken,charityController.deletePayeeParentGroupById);
charityRouter.post('/parent-payee/import', handleToken, charityController.importParentPayeeGroup);


// Patient Payee 
charityRouter.post('/patient-payee', handleToken, charityController.addPatientPayee);
charityRouter.get('/patient-payee', handleToken,charityController.getAllPatientPayee);
charityRouter.put('/patient-payee/:id', handleToken,charityController.updatePatientPayeeById);
charityRouter.put('/patient-payee/delete/:id', handleToken,charityController.deletePatientPayeeById);
charityRouter.post('/patient-payee/import', handleToken, charityController.importPatientPayee);


// Patient category 
charityRouter.post('/', handleToken, charityController.addcategory);
charityRouter.get('/', handleToken,charityController.getAllCategory);
charityRouter.put('/:id', handleToken,charityController.updateCategoryById);
charityRouter.put('/delete/:id', handleToken,charityController.deleteCategoryById);
charityRouter.post('/import', handleToken, charityController.bulkImport);

module.exports = charityRouter;