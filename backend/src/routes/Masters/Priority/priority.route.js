const express = require("express");
const priorityRouter = express.Router();
const { priorityController } = require("../../../controllers/index");
const { handleToken } = require("../../../utils/handleToken");

// Define routes
priorityRouter.get("/", handleToken, priorityController.getPriorityController);
priorityRouter.post("/", handleToken,  priorityController.postPriorityController);
priorityRouter.put("/update/:id",handleToken, priorityController.putPriorityController);
priorityRouter.delete("/:id",handleToken, priorityController.deletePriorityController);

module.exports = priorityRouter;
