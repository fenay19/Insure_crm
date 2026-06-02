const express=require("express");
const ipdFormSetup=express.Router();

const { getIpdFormSetupController, createIpdFormSetupController, updateIpdFormController, deleteIpdFormSetupController } = require('../../controllers/ipd-form-setup/ipdFormSetup.controller')


ipdFormSetup.get('/files', getIpdFormSetupController)
ipdFormSetup.post('/files', createIpdFormSetupController)
ipdFormSetup.put('/:id', updateIpdFormController)
ipdFormSetup.delete('/:id', deleteIpdFormSetupController)


module.exports=ipdFormSetup