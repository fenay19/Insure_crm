const express = require("express");
const TypeRouter = express.Router();
const typeController = require("../../../controllers/Masters/medicine/typeController");
const { handleToken } = require("../../../utils/handleToken");

// Create a new Type
TypeRouter.post("/", handleToken, typeController.createType);
TypeRouter.post("/import", handleToken, typeController.bulkImport);

// Get all Types (excluding deleted ones)
TypeRouter.get("/", handleToken, typeController.getAllTypes);

// Update a Type by ID
TypeRouter.put("/:id", handleToken, typeController.updateType);

// Soft Delete a Type by ID
TypeRouter.put("/delete/:id", handleToken, typeController.deleteType);

module.exports = TypeRouter;
