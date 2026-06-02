const express = require('express')
const positionRouter = express.Router()
const { positionController } = require('../../../controllers/index')

const { handleToken } = require('../../../utils/handleToken')

positionRouter.get('/', positionController.getPositionController)
positionRouter.post('/', positionController.postPositionController)
positionRouter.put('/:id',  positionController.putPositionController)
positionRouter.delete('/:id',  positionController.deletePositionController)


module.exports = positionRouter