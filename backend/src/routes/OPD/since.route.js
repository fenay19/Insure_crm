const express = require('express');
const SinceRouter = express.Router();
const sinceController = require("../../controllers/OPD/since.controller");
const {handleToken} = require('../../utils/handleToken');

SinceRouter.post("/",handleToken, sinceController.createSince);
SinceRouter.get("/",handleToken, sinceController.getAllSince);
SinceRouter.put("/:id",handleToken, sinceController.updateSince);
SinceRouter.delete("/delete/:id",handleToken, sinceController.deleteSince);

module.exports = SinceRouter;

