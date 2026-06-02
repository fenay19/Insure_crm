const express = require('express')
const leaveTypeRouter = express.Router()
const { leaveTypeController } = require('../../../controllers/index')

const { handleToken } = require('../../../utils/handleToken')

leaveTypeRouter.get('/', handleToken, leaveTypeController.getLeaveTypeController)
leaveTypeRouter.post('/', handleToken, leaveTypeController.postLeaveTypeController)
leaveTypeRouter.put('/:id', handleToken,leaveTypeController.putLeaveTypeController)
leaveTypeRouter.delete('/:id', handleToken, leaveTypeController.deleteLeaveTypeController)

module.exports = leaveTypeRouter