const express = require("express");
const AdmincontactPersonRouter = express.Router();
const { AdminContactPersonController } = require("../../controllers/index");

AdmincontactPersonRouter.get("/", AdminContactPersonController.getAllAdminContactPerson);
AdmincontactPersonRouter.post("/", AdminContactPersonController.createAdminContactPerson);
AdmincontactPersonRouter.put("/:id", AdminContactPersonController.updateAdminContactPerson);
AdmincontactPersonRouter.delete("/:id", AdminContactPersonController.deleteAdminContactPerson);
AdmincontactPersonRouter.get("/:id", AdminContactPersonController.getAdminContactPersonById);

module.exports = AdmincontactPersonRouter;