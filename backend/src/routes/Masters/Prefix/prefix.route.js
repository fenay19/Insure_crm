const express = require("express");
const prefixRouter = express.Router();
const { prefixController } = require("../../../controllers/index");
const { validatePrefixMaster } = require("../../../validations/Masters/prefixMaster.validation");
const {handleToken} = require('../../../utils/handleToken'); 

prefixRouter.get("/", handleToken, prefixController.getPrefix);
prefixRouter.post("/", handleToken, validatePrefixMaster, prefixController.addPrefix);
prefixRouter.put("/:id", handleToken, prefixController.updatePrefix);
prefixRouter.put("/delete/:id", handleToken, prefixController.deletePrefix);

module.exports = prefixRouter;
