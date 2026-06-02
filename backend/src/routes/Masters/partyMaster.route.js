const express = require("express");
const partyMasterRouter = express.Router();
const { partyMasterController } = require("../../controllers");
const { validatePartyMaster } = require("../../validations/Masters/partyMaster.validation");
const {handleToken} = require('../../utils/handleToken'); 

partyMasterRouter.get("/", handleToken, partyMasterController.getAllParty);
partyMasterRouter.post("/", handleToken, validatePartyMaster, partyMasterController.addParty);
partyMasterRouter.post("/import", handleToken, partyMasterController.bulkImport);
partyMasterRouter.put("/:id", handleToken, partyMasterController.editParty);
partyMasterRouter.get("/:id", handleToken, partyMasterController.getSingleParty);
partyMasterRouter.put("/delete/:id", handleToken, partyMasterController.deleteParty);

module.exports = partyMasterRouter;