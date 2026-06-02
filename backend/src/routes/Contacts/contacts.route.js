const express = require("express");
const contactRouter = express.Router();
const {  contactsController} = require("../../controllers/index");

const { handleToken } = require('../../utils/handleToken')
  
contactRouter.post("/", handleToken, contactsController.createContact); // create contact
contactRouter.get("/",handleToken, contactsController.getContacts); // 
contactRouter.get("/:id",handleToken, contactsController.getContactById);
contactRouter.put("/:id",handleToken, contactsController.updateContact);
contactRouter.delete("/:id", handleToken, contactsController.deleteContact);
module.exports = contactRouter ;
