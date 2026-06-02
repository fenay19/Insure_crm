const express = require("express");
const SubProductCategoryRouter = express.Router();
const SubProductCategoryController = require("../../../controllers/Masters/SubProductCategory/SubProductCategory.controller");

const { handleToken } = require("../../../utils/handleToken");

SubProductCategoryRouter.get(
  "/",
  handleToken,
  SubProductCategoryController.getSubProductCategoryController
);
SubProductCategoryRouter.get(
  "/:productName",
  SubProductCategoryController.getSubProductCategoryByProduct
);
SubProductCategoryRouter.post(
  "/",
  handleToken,
  SubProductCategoryController.postSubProductCategoryController
);
SubProductCategoryRouter.put(
  "/:id",
  handleToken,
  SubProductCategoryController.putSubProductCategoryController
);
SubProductCategoryRouter.delete(
  "/:id",
  handleToken,
  SubProductCategoryController.deleteSubProductCategoryController
);

module.exports = SubProductCategoryRouter;
