const express = require("express");
const vehicleTypeRouter = express.Router();
const { vehicleTypeControllers } = require("../../../controllers/index");
const { handleToken } = require("../../../utils/handleToken");

vehicleTypeRouter.get("/", vehicleTypeControllers.getVehicleTypeController);
vehicleTypeRouter.post("/", vehicleTypeControllers.postVehicleTypeController);
vehicleTypeRouter.put("/:id", vehicleTypeControllers.putVehicleTypeController);
vehicleTypeRouter.delete(
  "/:id",
  vehicleTypeControllers.deleteVehicleTypeController
);

module.exports = vehicleTypeRouter;
