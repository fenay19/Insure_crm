const express = require("express");
const departmentSubTypeRouter = express.Router();
const {
    createDepartmentSubType,
    getDepartmentSubTypes,
    updateDepartmentSubTypeById,
    deleteDepartmentSubTypeById,
    bulkImport
} = require("../controllers/departmentSubType.controller");
const { handleToken } = require("../utils/handleToken");


departmentSubTypeRouter.post("/",handleToken,createDepartmentSubType);

departmentSubTypeRouter.get("/", handleToken, getDepartmentSubTypes);

departmentSubTypeRouter.put("/:id", handleToken, updateDepartmentSubTypeById);

departmentSubTypeRouter.put("/delete/:id", handleToken, deleteDepartmentSubTypeById);

departmentSubTypeRouter.post("/import", handleToken, bulkImport)

module.exports = departmentSubTypeRouter;
