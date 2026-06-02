const express = require("express");
const refferByRouter = express.Router();
const { refferByController } = require("../../controllers");
const {handleToken} = require('../../utils/handleToken'); 

refferByRouter.get("/", handleToken, refferByController.getAllRefferBy);
refferByRouter.post("/", handleToken, refferByController.addRefferBy);

module.exports = refferByRouter;
