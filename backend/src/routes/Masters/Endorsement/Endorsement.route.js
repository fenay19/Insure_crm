const express = require("express");
const endorsementRouter = express.Router();
const { endorsementControllers } = require("../../../controllers/index");
const { handleToken } = require("../../../utils/handleToken");

endorsementRouter.get("/", endorsementControllers.getEndorsementController);
endorsementRouter.post("/", endorsementControllers.postEndorsementController);
endorsementRouter.put("/:id", endorsementControllers.putEndorsementController);
endorsementRouter.delete(
  "/:id",
  endorsementControllers.deleteEndorsementController
);

module.exports = endorsementRouter;
