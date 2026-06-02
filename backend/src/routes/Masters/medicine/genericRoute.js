const express = require("express");
const GenericRouter = express.Router();
const genericController = require("../../../controllers/Masters/medicine/genericController");
const {handleToken} = require('../../../utils/handleToken'); 

// Create a new Generic
GenericRouter.post("/", handleToken,genericController.createGeneric);
GenericRouter.post("/import", handleToken,genericController.bulkImport);

// Get all Generics (excluding deleted ones)
GenericRouter.get("/",handleToken, genericController.getAllGenerics);

// Update a Generic by ID
GenericRouter.put("/:id",handleToken, genericController.updateGeneric);

// Soft Delete a Generic by ID
GenericRouter.put("/delete/:id", handleToken,genericController.deleteGeneric);

module.exports = GenericRouter;
