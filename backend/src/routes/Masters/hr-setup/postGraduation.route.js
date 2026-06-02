const express = require('express')
const PostGraduationRouter = express.Router()
const {postGraduationController} = require('../../../controllers');
const {handleToken} = require('../../../utils/handleToken'); 


PostGraduationRouter.post('/', postGraduationController.createPostGraduation)
PostGraduationRouter.get('/', postGraduationController.getAllPostGraduation)
PostGraduationRouter.put('/:id', postGraduationController.updatePostGraduation)
PostGraduationRouter.put('/delete/:id', postGraduationController.deletePostGraduation)


module.exports = PostGraduationRouter