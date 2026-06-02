const express = require('express')
const statusRouter = express.Router()
const { statusController } = require('../../../controllers/index')
const { handleToken } = require('../../../utils/handleToken')

statusRouter.get('/', handleToken, statusController.getStatusController)
statusRouter.post('/', handleToken, statusController.postStatusController)
statusRouter.put('/:id',handleToken, statusController.putStatusController)
statusRouter.delete('/:id',handleToken, statusController.deleteStatusController)


module.exports = statusRouter