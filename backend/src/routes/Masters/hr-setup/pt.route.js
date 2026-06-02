const express = require('express')
const PTRouter = express.Router()

const PTController = require('../../../controllers/Masters/hr-setup/pt.controller')


PTRouter.post('/', PTController.createPT)
PTRouter.get('/', PTController.getPT)
PTRouter.put('/:id', PTController.updatePT)
PTRouter.delete('/:id', PTController.deletePT)

module.exports = PTRouter