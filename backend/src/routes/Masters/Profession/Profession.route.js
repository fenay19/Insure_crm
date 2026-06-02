const express = require('express')
const professionRouter = express.Router()
const { professionController } = require('../../../controllers/index')
const { handleToken } = require('../../../utils/handleToken')

professionRouter.get('/', handleToken, professionController.getProfessionController)
professionRouter.post('/',  handleToken, professionController.postProfessionController)
professionRouter.put('/:id', handleToken, professionController.putProfessionController)
professionRouter.delete('/:id', handleToken, professionController.deleteProfessionController)


module.exports = professionRouter