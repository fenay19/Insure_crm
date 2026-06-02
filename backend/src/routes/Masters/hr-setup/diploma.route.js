const express = require('express')

const DiplomaRouter = express.Router()
const { diplomaController } = require('../../../controllers')
const { handleToken } = require('../../../utils/handleToken')

DiplomaRouter.post('/', diplomaController.createDiploma)
DiplomaRouter.get('/', diplomaController.getAllDiploma)
DiplomaRouter.put('/:id', diplomaController.updateDiploma)
DiplomaRouter.put('/delete/:id', diplomaController.deleteDiploma)

module.exports = DiplomaRouter
