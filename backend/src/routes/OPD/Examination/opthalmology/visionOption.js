const { Router } = require("express");
const visionOptionRouter = Router();
const { handleToken } = require("../../../../utils/handleToken");
const {
  createVisionOption,
  deleteVisionOption,
  getAllVisionOptions,
  updateVisionOption,
} = require("../../../../controllers/OPD/Examination/opthalmology/visionOption");

visionOptionRouter.post("/", handleToken, createVisionOption);
visionOptionRouter.delete("/delete", handleToken, deleteVisionOption);
visionOptionRouter.get("/", handleToken, getAllVisionOptions);

module.exports = visionOptionRouter;
