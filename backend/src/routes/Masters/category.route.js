const express = require('express');
const categoryRouter = express.Router();
const { categoryController } = require("../../controllers");
const {handleToken} = require('../../utils/handleToken'); 

// Parent Group
categoryRouter.post('/parent-group', handleToken, categoryController.addParentGroup);
categoryRouter.get('/parent-group', handleToken,categoryController.getAllParentGroup);
categoryRouter.put('/parent-group/:id', handleToken,categoryController.updateParentGroupById);
categoryRouter.put('/parent-group/delete/:id', handleToken,categoryController.deleteParentGroupById);
categoryRouter.post('/parent-group/import', handleToken, categoryController.importParentGroup);


// Payee Group
categoryRouter.post('/payee-group', handleToken, categoryController.addPayeeParentGroup);
categoryRouter.get('/payee-group', handleToken,categoryController.getAllPayeeParentGroup);
categoryRouter.put('/payee-group/:id', handleToken,categoryController.updatePayeeParentGroupById);
categoryRouter.put('/payee-group/delete/:id', handleToken,categoryController.deletePayeeParentGroupById);
categoryRouter.post('/parent-payee/import', handleToken, categoryController.importParentPayeeGroup);


// Patient Payee 
categoryRouter.post('/patient-payee', handleToken, categoryController.addPatientPayee);
categoryRouter.get('/patient-payee', handleToken,categoryController.getAllPatientPayee);
categoryRouter.put('/patient-payee/:id', handleToken,categoryController.updatePatientPayeeById);
categoryRouter.put('/patient-payee/delete/:id', handleToken,categoryController.deletePatientPayeeById);
categoryRouter.post('/patient-payee/import', handleToken, categoryController.importPatientPayee);


// Patient category 
categoryRouter.post('/', handleToken, categoryController.addcategory);
categoryRouter.get('/', handleToken,categoryController.getAllCategory);
categoryRouter.put('/:id', handleToken,categoryController.updateCategoryById);
categoryRouter.put('/delete/:id', handleToken,categoryController.deleteCategoryById);
categoryRouter.post('/import', handleToken, categoryController.bulkImport);

module.exports = categoryRouter;