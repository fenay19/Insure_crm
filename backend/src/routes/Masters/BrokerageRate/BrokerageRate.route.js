const express = require("express");
const brokerageRateRouter = express.Router();
const { brokerageRateControllers } = require("../../../controllers/index");
const { handleToken } = require("../../../utils/handleToken");

brokerageRateRouter.get(
  "/",
  brokerageRateControllers.getBrokerageRateController
);
brokerageRateRouter.post(
  "/",
  brokerageRateControllers.postBrokerageRateController
);
brokerageRateRouter.put(
  "/:id",
  brokerageRateControllers.putBrokerageRateController
);
brokerageRateRouter.delete(
  "/:id",
  brokerageRateControllers.deleteBrokerageRateController
);

module.exports = brokerageRateRouter;
