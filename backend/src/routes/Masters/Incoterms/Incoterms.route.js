const express = require("express");
const incotermsRouter = express.Router();
const { incotermsControllers } = require("../../../controllers/index");
const { handleToken } = require("../../../utils/handleToken");

incotermsRouter.get("/", incotermsControllers.getIncotermsController);
incotermsRouter.post("/", incotermsControllers.postIncotermsController);
incotermsRouter.put("/:id", incotermsControllers.putIncotermsController);
incotermsRouter.delete("/:id", incotermsControllers.deleteIncotermsController);

module.exports = incotermsRouter;
