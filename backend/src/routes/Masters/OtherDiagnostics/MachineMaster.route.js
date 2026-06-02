const express = require("express");
const otherDiagnosticsMachineRoute = express.Router();
const {
  addMachine,
  bulkImport,
  deleteMachine,
  editMachine,
  getAllMachine,
  getSingleMachine,
} = require("../../../controllers/Masters/OtherDiagnostics/MachineMaster.controller");
const { handleToken } = require("../../../utils/handleToken");

otherDiagnosticsMachineRoute.get("/", handleToken, getAllMachine);

otherDiagnosticsMachineRoute.post("/", handleToken, addMachine);

otherDiagnosticsMachineRoute.post("/import", handleToken, bulkImport);

otherDiagnosticsMachineRoute.get("/:id", handleToken, getSingleMachine);

otherDiagnosticsMachineRoute.put("/:id", handleToken, editMachine);

otherDiagnosticsMachineRoute.put("/delete/:id", handleToken, deleteMachine);

module.exports = otherDiagnosticsMachineRoute;
