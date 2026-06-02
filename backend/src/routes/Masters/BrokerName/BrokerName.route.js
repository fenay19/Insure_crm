const express = require("express");
const brokerNameRouter = express.Router();
const { brokerNameControllers } = require("../../../controllers/index");
const { handleToken } = require("../../../utils/handleToken");

brokerNameRouter.get("/", brokerNameControllers.getBrokerNameController);
brokerNameRouter.post("/", brokerNameControllers.postBrokerNameController);
brokerNameRouter.put("/:id", brokerNameControllers.putBrokerNameController);
brokerNameRouter.delete(
  "/:id",
  brokerNameControllers.deleteBrokerNameController
);

module.exports = brokerNameRouter;
