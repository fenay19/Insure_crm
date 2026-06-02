const express = require("express");
const brokerBranchRouter = express.Router();
const BrokerBranchControllers = require("../../../controllers/Masters/BrokerBranch/BrokerBranch.controller");

const { handleToken } = require('../../../utils/handleToken')

brokerBranchRouter.get("/",BrokerBranchControllers.getBrokerBranchController);
brokerBranchRouter.post("/",BrokerBranchControllers.postBrokerBranchController);
brokerBranchRouter.put("/:id",BrokerBranchControllers.putBrokerBranchController);
brokerBranchRouter.delete("/:id",BrokerBranchControllers.deleteBrokerBranchController);

module.exports = brokerBranchRouter;