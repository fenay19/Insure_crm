const express = require('express')
const leadReferenceRouter = express.Router()
const { leadReferenceController } = require('../../../controllers/index')
const { handleToken } = require('../../../utils/handleToken')

leadReferenceRouter.get('/', handleToken, leadReferenceController.getLeadReferenceController)
leadReferenceRouter.post('/', handleToken, leadReferenceController.postLeadReferenceController)
leadReferenceRouter.put('/:id',handleToken, leadReferenceController.putLeadReferenceController)
leadReferenceRouter.delete('/:id', handleToken, leadReferenceController.deleteLeadReferenceController)

module.exports = leadReferenceRouter