const express = require('express')
const leadStatusRouter = express.Router()
const { leadStatusController } = require('../../../controllers/index')

const { handleToken } = require('../../../utils/handleToken')


leadStatusRouter.get('/', handleToken, leadStatusController.getLeadStatusController)
leadStatusRouter.post('/', handleToken, leadStatusController.postLeadStatusController)
leadStatusRouter.put('/:id', handleToken, leadStatusController.putLeadStatusController)
leadStatusRouter.delete('/:id', handleToken, leadStatusController.deleteLeadStatusController)

module.exports = leadStatusRouter