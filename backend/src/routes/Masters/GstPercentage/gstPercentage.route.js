const express = require("express");
const gstPercentageRouter = express.Router();

const { gstPercentageController } = require("../../../controllers/index");

const { handleToken } = require('../../../utils/handleToken')

//  createGst,
//   getAllGsts,
//   getGstById,
//   updateGst,
//   deleteGst,
gstPercentageRouter.post("/", handleToken, gstPercentageController.createGst);
gstPercentageRouter.get("/", handleToken, gstPercentageController.getAllGsts);
gstPercentageRouter.get("/:id", handleToken,  gstPercentageController.getGstById);
gstPercentageRouter.put("/:id",handleToken, gstPercentageController.updateGst);
gstPercentageRouter.delete("/:id",handleToken, gstPercentageController.deleteGst);

module.exports = gstPercentageRouter;