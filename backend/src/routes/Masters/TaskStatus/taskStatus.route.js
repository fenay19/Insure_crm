const express = require('express')
const taskStatusRouter = express.Router()
const { taskStatusController } = require('../../../controllers/index')
const { handleToken } = require('../../../utils/handleToken')

taskStatusRouter.get('/', handleToken, taskStatusController.getTaskStatusController)
taskStatusRouter.post('/', handleToken, taskStatusController.postTaskStatusController)
taskStatusRouter.put('/:id',handleToken, taskStatusController.putTaskStatusController)
taskStatusRouter.delete('/:id',handleToken, taskStatusController.deleteTaskStatusController)

module.exports = taskStatusRouter