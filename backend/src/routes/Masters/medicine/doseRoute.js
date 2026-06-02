const express = require('express')

const DoseRouter = express.Router()

const doseController = require('../../../controllers/Masters/medicine/doseController')

const { handleToken } = require('../../../utils/handleToken')

DoseRouter.post('/', doseController.createDose)
DoseRouter.post('/import', doseController.bulkImport)

DoseRouter.get('/', doseController.getAllDose)

DoseRouter.put('/:id', doseController.updateDose)

DoseRouter.put('/delete/:id', doseController.deleteDose)

module.exports = DoseRouter
