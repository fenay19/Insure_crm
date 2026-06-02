const express = require('express');
const insDepartmentRouter = express.Router();
const {insDepartmentControllers} = require("../../../controllers/index");
const { handleToken } = require("../../../utils/handleToken");


insDepartmentRouter.get('/', insDepartmentControllers.getInsDepartmentController);
insDepartmentRouter.post('/', insDepartmentControllers.postInsDepartmentController);
insDepartmentRouter.put('/:id', insDepartmentControllers.putInsDepartmentController)
insDepartmentRouter.delete('/:id', insDepartmentControllers.deleteInsDepartmentController)


module.exports = insDepartmentRouter