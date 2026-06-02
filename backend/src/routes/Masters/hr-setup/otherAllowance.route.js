const express = require('express')
const OtherAllowanceRouter = express.Router()

const OtherAllowanceController = require('../../../controllers/Masters/hr-setup/otherAllowances.controller')
const { handleToken } = require('../../../utils/handleToken')

OtherAllowanceRouter.post('/', OtherAllowanceController.createOtherAllowances)
OtherAllowanceRouter.get('/', OtherAllowanceController.getOtherAllowances)
OtherAllowanceRouter.put('/:id', OtherAllowanceController.updateOtherAllowances)
OtherAllowanceRouter.delete('/delete/:id', OtherAllowanceController.deleteOtherAllowances)

module.exports = OtherAllowanceRouter