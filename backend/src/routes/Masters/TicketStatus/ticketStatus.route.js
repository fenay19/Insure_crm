const express = require('express')
const ticketStatusRouter = express.Router()
const { ticketStatusController } = require('../../../controllers/index')
const { handleToken } = require('../../../utils/handleToken')

ticketStatusRouter.get('/', handleToken, ticketStatusController.getTicketStatusController)
ticketStatusRouter.post('/', handleToken, ticketStatusController.postTicketStatusController)
ticketStatusRouter.put('/:id', handleToken,ticketStatusController.putTicketStatusController)
ticketStatusRouter.delete('/:id',handleToken, ticketStatusController.deleteTicketStatusController)

module.exports = ticketStatusRouter