const express = require('express');
const billGroupRouter = express.Router();
const { validateBillGroup } = require('../../validations/Masters/billGroup.validation');
const { billGroupController } = require("../../controllers");
const {handleToken} = require('../../utils/handleToken'); 


billGroupRouter.post('/', handleToken,validateBillGroup, billGroupController.createBillGroup);

billGroupRouter.post('/import', handleToken, billGroupController.bulkImport);

billGroupRouter.get('/', handleToken,billGroupController.getAllBillGroups);

billGroupRouter.get('/:id', handleToken,billGroupController.getBillGroupById);

billGroupRouter.put('/:id', handleToken,billGroupController.updateBillGroupById);

billGroupRouter.put('/delete/:id', handleToken,billGroupController.deleteBillGroupById);

module.exports = billGroupRouter;