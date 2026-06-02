const express = require('express');
const {
  createFormSetup,
  getAllFormSetups,
  getFormSetupById,
  updateFormSetup,
  deleteFormSetup,
} = require('../../controllers/Masters/formSetup.controller');
const {handleToken} = require('../../utils/handleToken'); 

const FormSetupRouter = express.Router();

FormSetupRouter.post('/',handleToken, createFormSetup);
FormSetupRouter.get('/',handleToken, getAllFormSetups);
FormSetupRouter.get('/:id',handleToken, getFormSetupById);
FormSetupRouter.put('/:id',handleToken, updateFormSetup);
FormSetupRouter.delete('/delete/:id',handleToken, deleteFormSetup);

module.exports = FormSetupRouter;
