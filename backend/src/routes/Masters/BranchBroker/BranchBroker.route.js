const express = require("express");
const branchBrokerRouter = express.Router();
const { branchBrokerControllers } = require("../../../controllers/index");
const { handleToken } = require("../../../utils/handleToken");

branchBrokerRouter.get("/", branchBrokerControllers.getBranchBrokerController);
branchBrokerRouter.post(
  "/",
  branchBrokerControllers.postBranchBrokerController
);
branchBrokerRouter.put(
  "/:id",
  branchBrokerControllers.putBranchBrokerController
);
branchBrokerRouter.delete(
  "/:id",
  branchBrokerControllers.deleteBranchBrokerController
);

module.exports = branchBrokerRouter;
