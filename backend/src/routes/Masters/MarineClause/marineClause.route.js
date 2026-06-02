const express = require("express");
const marineClauseRouter = express.Router();
const { marineClauseControllers } = require("../../../controllers/index");
const { handleToken } = require("../../../utils/handleToken");

marineClauseRouter.get("/", marineClauseControllers.getMarineClauseController);
marineClauseRouter.post(
  "/",
  marineClauseControllers.postMarineClauseController
);
marineClauseRouter.put(
  "/:id",
  marineClauseControllers.putMarineClauseController
);
marineClauseRouter.delete(
  "/:id",
  marineClauseControllers.deleteMarineClauseController
);

module.exports = marineClauseRouter;
