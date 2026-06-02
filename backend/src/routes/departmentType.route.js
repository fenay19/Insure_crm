const express = require("express");
const departmentTypeRouter = express.Router();
const {
  createDepartmentType,
  getDepartmentTypes,
  updateDepartment,
  deleteDepartmentType,
  bulkImport
} = require("../controllers/departmentType.controller");
const { handleToken } = require("../utils/handleToken");

departmentTypeRouter.post("/", handleToken, createDepartmentType);
departmentTypeRouter.get("/", handleToken, getDepartmentTypes);
departmentTypeRouter.put("/:id", handleToken, updateDepartment);
departmentTypeRouter.put("/delete/:id", handleToken, deleteDepartmentType);
departmentTypeRouter.post("/import", bulkImport)

module.exports = departmentTypeRouter;
