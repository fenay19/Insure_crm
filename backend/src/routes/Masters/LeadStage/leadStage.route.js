const express = require('express')
const leadStageRouter = express.Router()
const { leadStageController } = require('../../../controllers/index')

const { handleToken } = require('../../../utils/handleToken')

leadStageRouter.get('/leadStage', handleToken, leadStageController.getLeadStageController)
leadStageRouter.post('/leadStage', handleToken, leadStageController.postLeadStageController)
leadStageRouter.put('/leadStage/:id', handleToken, leadStageController.putLeadStageController)
leadStageRouter.delete('/leadStage/:id', handleToken, leadStageController.deleteLeadStageController)

module.exports = leadStageRouter