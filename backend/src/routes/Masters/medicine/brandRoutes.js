const express = require("express");

const BrandRouter = express.Router();

const BrandController = require("../../../controllers/Masters/medicine/brandController");

const { handleToken } = require("../../../utils/handleToken");

BrandRouter.post("/", BrandController.createBrandName);
BrandRouter.put("/:id", BrandController.updateBrandName);
BrandRouter.get("/", BrandController.getAllBrands);
BrandRouter.put("/delete/:id", BrandController.deleteBrands);
BrandRouter.post("/import", BrandController.bulkImport);

module.exports = BrandRouter;
