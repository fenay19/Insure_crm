const express = require('express');
const departmentRouter = express.Router();
const { departmentController } = require('../controllers');
const {handleToken} = require('../utils/handleToken'); 

departmentRouter.post('/', handleToken,departmentController.createDepartment);

departmentRouter.get('/', handleToken,departmentController.getAllDepartments);

departmentRouter.get('/:id', handleToken,departmentController.getDepartmentById);

departmentRouter.put('/:id', handleToken, departmentController.updateDepartment);

departmentRouter.put('/delete/:id', handleToken,departmentController.deleteDepartment);
departmentRouter.get('/generate/departmentCode', handleToken,departmentController.generateDepartmentCode);



// import
departmentRouter.post('/import', handleToken,departmentController.bulkImport);

module.exports = departmentRouter;
