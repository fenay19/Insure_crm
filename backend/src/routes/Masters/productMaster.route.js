const express = require("express");
const productMasterRouter = express.Router();
const { productMasterController } = require("../../controllers");
// const { validateProductMaster } = require("../../validations/Masters/productMasterValidation");
const {handleToken} = require('../../utils/handleToken'); 

productMasterRouter.post("/",  handleToken, productMasterController.addProduct);
productMasterRouter.post("/import",  handleToken, productMasterController.bulkImport);
productMasterRouter.put("/:id", handleToken,  productMasterController.editProduct);
productMasterRouter.get("/", handleToken, productMasterController.getAllProduct);
productMasterRouter.get("/:id", handleToken, productMasterController.getSingleProduct);
productMasterRouter.put("/delete/:id", handleToken, productMasterController.deleteProduct);

module.exports = productMasterRouter;