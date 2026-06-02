const { AdminTypeOfClientController } = require("../../controllers/index")

const express = require("express");
const AdmintypeOfClientRouter = express.Router();

AdmintypeOfClientRouter.get("/", AdminTypeOfClientController.getAdminTypeOfClient);
AdmintypeOfClientRouter.get("/:id", AdminTypeOfClientController.getAdminTypeOfClientById);
AdmintypeOfClientRouter.post("/", AdminTypeOfClientController.createAdminTypeOfClient);
AdmintypeOfClientRouter.put("/:id", AdminTypeOfClientController.updateAdminTypeOfClient);
AdmintypeOfClientRouter.delete("/:id", AdminTypeOfClientController.deleteAdminTypeOfClient);

module.exports = AdmintypeOfClientRouter;