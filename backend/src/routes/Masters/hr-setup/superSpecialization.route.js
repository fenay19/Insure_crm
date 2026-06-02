const express = require('express')
const SuperSpecializationRouter = express.Router()
const { superSpecializationController } = require('../../../controllers')
const { handleToken } = require('../../../utils/handleToken')

SuperSpecializationRouter.post(
  '/',
  superSpecializationController.createSuperSpecialization
)
SuperSpecializationRouter.get(
  '/',
  superSpecializationController.getAllSuperSpecialization
)
SuperSpecializationRouter.put(
  '/:id',
  superSpecializationController.updateSuperSpecialization
)
SuperSpecializationRouter.put(
  '/delete/:id',
  superSpecializationController.deleteSuperSpecialization
)

module.exports = SuperSpecializationRouter
