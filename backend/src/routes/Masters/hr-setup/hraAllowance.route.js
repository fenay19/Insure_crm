const express = require('express')
const HRAAllowanceRouter = express.Router()

const {hraAllowanceController} = require('../../../controllers')
const { handleToken } = require('../../../utils/handleToken')

HRAAllowanceRouter.post('/', hraAllowanceController.createHRAAllowance)
HRAAllowanceRouter.get('/', hraAllowanceController.getAllHRAAllowances)
HRAAllowanceRouter.put('/:id', hraAllowanceController.updateHRAAllowance)
HRAAllowanceRouter.put('/delete/:id', hraAllowanceController.deleteHRAAllowance)

module.exports = HRAAllowanceRouter