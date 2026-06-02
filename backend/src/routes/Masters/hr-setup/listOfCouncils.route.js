const express = require('express')
const ListOfCouncilsRouter = express.Router()
const { listOfCouncilsController } = require('../../../controllers');
const {handleToken} = require('../../../utils/handleToken'); 

ListOfCouncilsRouter.post('/', listOfCouncilsController.createCouncil)
ListOfCouncilsRouter.get('/', listOfCouncilsController.getAllCouncils)
ListOfCouncilsRouter.put('/:id', listOfCouncilsController.updateCouncil)
ListOfCouncilsRouter.put('/delete/:id', listOfCouncilsController.deleteCouncil)
ListOfCouncilsRouter.post('/council/addMany', listOfCouncilsController.addAllCouncils)


module.exports = ListOfCouncilsRouter