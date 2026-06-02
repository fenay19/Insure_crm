const express = require("express");
const contactPersonRouter = express.Router();
const { contactPersonController } = require("../../controllers/index");

const { handleToken } = require('../../utils/handleToken')

contactPersonRouter.get("/", handleToken, contactPersonController.getAllContactPerson);
contactPersonRouter.post("/", handleToken, contactPersonController.createContactPerson);
contactPersonRouter.put("/:id", handleToken, contactPersonController.updateContactPerson);
contactPersonRouter.delete("/:id", handleToken, contactPersonController.deleteContactPerson);
contactPersonRouter.get("/:id", handleToken, contactPersonController.getContactPersonById);

module.exports = contactPersonRouter;