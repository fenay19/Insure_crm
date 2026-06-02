const express = require("express");
const procedureRoute = express.Router();
const {
  addProcedure,
  getAllProcedures,
  editProcedure,
  deleteProcedure,
  bulkImportProcedures,
} = require("../../../controllers/Masters/ProcedureMaster/Procedure.controller");

const { handleToken } = require("../../../utils/handleToken");

procedureRoute.get("/", handleToken, getAllProcedures);
procedureRoute.post("/", handleToken, addProcedure);
procedureRoute.post("/import", handleToken, bulkImportProcedures);
procedureRoute.put("/:id", handleToken, editProcedure);
procedureRoute.put("/delete/:id", handleToken, deleteProcedure);

module.exports = procedureRoute;
