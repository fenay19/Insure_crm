const express = require("express");
const timeIntervalMasterRouter = express.Router();
const {
  addTimeInterval,
  getTimeInterval,
  TimeInterval,
  deleteTimeInterval,
} = require("../../controllers/Masters/timeInterval.controller");

const { handleToken } = require("../../utils/handleToken");

timeIntervalMasterRouter.get("/", handleToken, getTimeInterval);
timeIntervalMasterRouter.post("/", handleToken, addTimeInterval);
timeIntervalMasterRouter.put("/:id", handleToken, TimeInterval);
timeIntervalMasterRouter.put("/delete/:id", handleToken, deleteTimeInterval);

module.exports = timeIntervalMasterRouter;
