const express = require("express");
const CategoryRouter = express.Router();
const categoryController = require("../../../controllers/Masters/medicine/categoryController");
const { handleToken } = require("../../../utils/handleToken");

CategoryRouter.post("/", handleToken, categoryController.createCategory);
CategoryRouter.post("/import", handleToken, categoryController.bulkImport);

CategoryRouter.get("/", handleToken, categoryController.getAllCategories);

CategoryRouter.put("/:id", handleToken, categoryController.updateCategory);

CategoryRouter.put(
  "/delete/:id",
  handleToken,
  categoryController.deleteCategory
);

module.exports = CategoryRouter;
