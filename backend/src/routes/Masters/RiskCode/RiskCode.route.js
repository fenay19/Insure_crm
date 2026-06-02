const express = require("express");
const riskCodeRouter = express.Router();
const { riskCodeControllers } = require("../../../controllers/index");
const { handleToken } = require("../../../utils/handleToken");

riskCodeRouter.get("/", riskCodeControllers.getRiskCodeController);
riskCodeRouter.post("/", riskCodeControllers.postRiskCodeController);
riskCodeRouter.put("/:id", riskCodeControllers.putRiskCodeController);
riskCodeRouter.delete("/:id", riskCodeControllers.deleteRiskCodeController);

module.exports = riskCodeRouter;
