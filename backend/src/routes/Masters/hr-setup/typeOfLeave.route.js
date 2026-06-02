const express = require('express')
const TypeOfLeaveRouter = express.Router()
const { typeOfLeaveController } = require('../../../controllers');


const {handleToken} = require('../../../utils/handleToken'); 

TypeOfLeaveRouter.post('/', typeOfLeaveController.createTypeOfLeave)
TypeOfLeaveRouter.get('/', typeOfLeaveController.getAllTypesOfLeave)
TypeOfLeaveRouter.put('/:id', typeOfLeaveController.updateTypeOfLeave)
TypeOfLeaveRouter.put('/delete/:id', typeOfLeaveController.deleteTypeOfLeave)


module.exports = TypeOfLeaveRouter
