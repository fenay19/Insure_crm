const express = require("express");
const investigationRadiologyMasterRoute = express.Router();
const {
  bulkCreateDiagnostics,
  createDiagnostic,
  fetchAllDiagnostics,
  modifyDiagnosticRateAndCode,
  removeDiagnostic,
  updateDiagnostic,
} = require("../../../controllers/Masters/OtherDiagnostics/OtherDiagnostics.controller");

const { handleToken } = require("../../../utils/handleToken");

// ✅ Fetch all diagnostics
investigationRadiologyMasterRoute.get("/", handleToken, fetchAllDiagnostics);

// ✅ Add a new diagnostic
investigationRadiologyMasterRoute.post("/", handleToken, createDiagnostic);

// ✅ Bulk import diagnostics
investigationRadiologyMasterRoute.post(
  "/import",
  handleToken,
  bulkCreateDiagnostics
);

// ✅ Update a diagnostic entry
investigationRadiologyMasterRoute.put("/:id", handleToken, updateDiagnostic);

// ✅ Update only rate and/or code
investigationRadiologyMasterRoute.patch(
  "/rate/:id",
  handleToken,
  modifyDiagnosticRateAndCode
);

// ✅ Delete a diagnostic (soft delete)
investigationRadiologyMasterRoute.delete("/:id", handleToken, removeDiagnostic);

module.exports = investigationRadiologyMasterRoute;
