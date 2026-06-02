const express = require('express')
const GraduationRouter = express.Router()
const { graduationController } = require('../../../controllers');
const {handleToken} = require('../../../utils/handleToken'); 


GraduationRouter.post('/', graduationController.createGraduation)
GraduationRouter.get('/', graduationController.getAllGraduation)
GraduationRouter.put('/:id', graduationController.updateGraduation)
GraduationRouter.put('/delete/:id', graduationController.deleteGraduation)


module.exports = GraduationRouter