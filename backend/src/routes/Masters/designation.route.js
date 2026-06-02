const express = require('express');
const designationRouter = express.Router();
const { designationController } = require('../../controllers');
const validateDesignation = require("../../validations/Masters/designation.validation");
const {handleToken} = require('../../utils/handleToken'); 

designationRouter.get('/', handleToken,designationController.getAllDesignation);


designationRouter.get('/:id', handleToken,designationController.getDesignation);

designationRouter.post('/', handleToken,validateDesignation, designationController.addDesignation);

designationRouter.post('/import', handleToken,designationController.bulkImport);

designationRouter.put('/:id', handleToken,designationController.updateDesignation);

designationRouter.put('/delete/:id', handleToken,designationController.deleteDesignationById);

module.exports = designationRouter;