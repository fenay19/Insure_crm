const express = require("express");
const otherAddonRouter = express.Router();
const { otherAddonControllers } = require("../../../controllers/index");
const { handleToken } = require("../../../utils/handleToken");

otherAddonRouter.get("/", otherAddonControllers.getOtherAddonController);
otherAddonRouter.post("/", otherAddonControllers.postOtherAddonController);
otherAddonRouter.put("/:id", otherAddonControllers.putOtherAddonController);
otherAddonRouter.delete(
  "/:id",
  otherAddonControllers.deleteOtherAddonController
);

module.exports = otherAddonRouter;
