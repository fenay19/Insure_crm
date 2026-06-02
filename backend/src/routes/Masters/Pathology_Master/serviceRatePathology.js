const express = require("express");
const serviceRatePathologyRouter = express.Router();
const {
  createServiceRate,
  getAllServiceRates,
} = require("../../../controllers/Masters/Pathology_Master/serviceRatePathology.controller");

const { handleToken } = require("../../../utils/handleToken");

serviceRatePathologyRouter.post(
  "/update-rate-code",
  handleToken,
  createServiceRate
);

serviceRatePathologyRouter.get(
  "/get-all-service-rate-pathology",
  handleToken,
  getAllServiceRates
);

module.exports = serviceRatePathologyRouter;
