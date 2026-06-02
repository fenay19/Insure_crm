const express = require('express')
const leadTypeRouter = express.Router()
const { leadTypeController } = require('../../../controllers/index')
const { handleToken } = require('../../../utils/handleToken')

leadTypeRouter.get('/', handleToken, leadTypeController.getLeadTypeController)
leadTypeRouter.post('/', handleToken, leadTypeController.postLeadTypeController)
leadTypeRouter.put('/:id', handleToken, leadTypeController.putLeadTypeController)
leadTypeRouter.delete('/:id',handleToken, leadTypeController.deleteLeadTypeController)


module.exports = leadTypeRouter