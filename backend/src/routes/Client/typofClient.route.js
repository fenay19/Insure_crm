const { typeOfClientController } = require("../../controllers/index")

const express = require("express");
const typeOfClientRouter = express.Router();


typeOfClientRouter.get("/", typeOfClientController.getTypeOfClient);
typeOfClientRouter.get("/:id", typeOfClientController.getTypeOfClientById);
typeOfClientRouter.post("/", typeOfClientController.createTypeOfClient);
typeOfClientRouter.put("/:id", typeOfClientController.updateTypeOfClient);
typeOfClientRouter.delete("/:id", typeOfClientController.deleteTypeOfClient);

module.exports = typeOfClientRouter;