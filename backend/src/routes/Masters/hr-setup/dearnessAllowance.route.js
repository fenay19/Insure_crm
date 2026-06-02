const express = require('express')
const DearnessAllowanceRouter = express.Router()

const {dearnessAllowanceController} = require('../../../controllers')
const { handleToken } = require('../../../utils/handleToken')

DearnessAllowanceRouter.post('/', dearnessAllowanceController.createDearnessAllowance)
DearnessAllowanceRouter.get('/', dearnessAllowanceController.getAllDearnessAllowances)
DearnessAllowanceRouter.put('/:id', dearnessAllowanceController.updateDearnessAllowance)
DearnessAllowanceRouter.put('/delete/:id', dearnessAllowanceController.deleteDearnessAllowance)

module.exports = DearnessAllowanceRouter