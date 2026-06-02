const express = require("express");
const EmployeeRoleRouter = express.Router();
const { EmployeeRoleController } = require("../../controllers");
const {handleToken} = require('../../utils/handleToken'); 

EmployeeRoleRouter.get("/", handleToken, EmployeeRoleController.getEmployeeRole);

EmployeeRoleRouter.get("/:id", handleToken, EmployeeRoleController.getEmployeeRoleById);    

EmployeeRoleRouter.post("/", handleToken, EmployeeRoleController.createEmployeeRole);

EmployeeRoleRouter.put("/:id", handleToken, EmployeeRoleController.updateEmployeeRole);

EmployeeRoleRouter.post('/import', handleToken,EmployeeRoleController.bulkImport);

EmployeeRoleRouter.delete("/:id", handleToken, EmployeeRoleController.deleteEmployeeRole);

module.exports = EmployeeRoleRouter;
