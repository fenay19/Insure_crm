const walkinController = require("../../controllers/Walkin/walkin.controller.js")
const {handleToken} = require('../../utils/handleToken');
const express = require('express');
 
const walkinRouter = express.Router();

walkinRouter.post("/createWalkin", handleToken, walkinController.createWalkin);
walkinRouter.get("/getWalkin", handleToken, walkinController.getWalking);
walkinRouter.get("/getSingleWalkin/:id", handleToken, walkinController.getSingleWalkin);
walkinRouter.put("/updateWalkin/:id", handleToken, walkinController.updateWalkin);
walkinRouter.put("/deleteWalkin/:id", handleToken, walkinController.deleteWalkin);

module.exports = walkinRouter;