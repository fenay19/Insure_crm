const express = require("express");
const chatRouter = express.Router(); // eslint-disable-line new-cap
const { chatController } = require("../../controllers");
const {handleToken} = require('../../utils/handleToken'); 

chatRouter.get("/", handleToken, chatController.getMessages);
chatRouter.post("/", handleToken, chatController.addMessage);
chatRouter.get("/users", handleToken, chatController.getAllUsers);

module.exports = chatRouter;