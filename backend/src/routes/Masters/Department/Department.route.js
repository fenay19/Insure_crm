const express = require('express')
const departmentRouter = express.Router()
const { departmentControllers } = require('../../../controllers/index')
const { handleToken } = require('../../../utils/handleToken')

departmentRouter.get('/', departmentControllers.getDepartmentController)
departmentRouter.post('/', departmentControllers.postDepartmentController)
departmentRouter.put('/:id', departmentControllers.putDepartmentController)
departmentRouter.delete('/:id', departmentControllers.deleteDepartmentController)


module.exports = departmentRouter