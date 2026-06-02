const express = require('express');
const productOrServiceCategoryRouter = express.Router();

// token middleware
const {handleToken} = require("../../../utils/handleToken");

const ProductOrServiceCategoryController = require("../../../controllers/Masters/productOrServiceCategory/productOrServiceCategory.controller")

// routes
productOrServiceCategoryRouter.get('/', handleToken,  ProductOrServiceCategoryController.getProductOrServiceCategory);
productOrServiceCategoryRouter.post('/', handleToken, ProductOrServiceCategoryController.postProductOrServiceCategory);
productOrServiceCategoryRouter.put('/:id', handleToken, ProductOrServiceCategoryController.putProductOrServiceCategory);
productOrServiceCategoryRouter.delete('/:id', handleToken, ProductOrServiceCategoryController.deleteProductOrServiceCategory);

// exports
module.exports = productOrServiceCategoryRouter;