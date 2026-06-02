const express = require("express");
const fuelTypeRouter = express.Router();
const { fuelTypeControllers } = require("../../../controllers/index");
const { handleToken } = require("../../../utils/handleToken");

fuelTypeRouter.get("/", fuelTypeControllers.getFuelTypeController);
fuelTypeRouter.post("/", fuelTypeControllers.postFuelTypeController);
fuelTypeRouter.put("/:id", fuelTypeControllers.putFuelTypeController);
fuelTypeRouter.delete("/:id", fuelTypeControllers.deleteFuelTypeController);

module.exports = fuelTypeRouter;
