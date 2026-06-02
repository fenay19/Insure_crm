const express = require("express");
const {
  createServiceRate,
  getAllServiceRates,
  getServiceRateById,
  updateServiceRate,
  deleteServiceRate,
  bulkImport
} = require("../../controllers/Masters/serviceRate.controller");
const { handleToken } = require("../../utils/handleToken");

const ServiceRateRouter = express.Router();

ServiceRateRouter.post("/",handleToken, createServiceRate);

ServiceRateRouter.get("/",handleToken, getAllServiceRates);

ServiceRateRouter.get("/:id",handleToken, getServiceRateById);

ServiceRateRouter.put("/:id",handleToken, updateServiceRate);

ServiceRateRouter.delete("/delete/:id",handleToken, deleteServiceRate);
ServiceRateRouter.post('/import', bulkImport);

module.exports = ServiceRateRouter;
