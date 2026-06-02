const express = require("express");
const ledgerMasterRouter = express.Router();
const { LegderMasterController } = require("../../controllers");
const {handleToken} = require('../../utils/handleToken'); 

ledgerMasterRouter.get("/", handleToken, LegderMasterController.getLedger);
ledgerMasterRouter.post("/", handleToken, LegderMasterController.addLedger);
ledgerMasterRouter.put("/:id", handleToken, LegderMasterController.updateLedger);
ledgerMasterRouter.put("/delete/:id", handleToken, LegderMasterController.deleteLedger);
ledgerMasterRouter.post("/import", handleToken, LegderMasterController.bulkLedgerImport);

// Sub ledger MasterController

ledgerMasterRouter.get("/sub-ledger", handleToken, LegderMasterController.getSubLedger);
ledgerMasterRouter.post("/sub-ledger", handleToken, LegderMasterController.addSubLedger);
ledgerMasterRouter.put("/sub-ledger/:id", handleToken, LegderMasterController.updateSubLedger);
ledgerMasterRouter.put("/sub-ledger/delete/:id", handleToken, LegderMasterController.deleteSubLedger);
ledgerMasterRouter.post("/sub-ledger/import", handleToken, LegderMasterController.bulkSubLedgerImport);

module.exports = ledgerMasterRouter;
