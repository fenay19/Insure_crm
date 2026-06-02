const express = require("express");
const ticketManageRouter = express.Router();
const {ticketManagementController}=require('../../controllers/index');

const { handleToken } = require('../../utils/handleToken')


ticketManageRouter.post("/", handleToken,ticketManagementController.CreateTicketManagement);
ticketManageRouter.get("/", handleToken, ticketManagementController.GetAllTicketManagement);
ticketManageRouter.get("/:id", handleToken, ticketManagementController.GetTicketByID);
ticketManageRouter.put("/:id", handleToken, ticketManagementController.UpdateTicket);
ticketManageRouter.delete("/:id",handleToken, ticketManagementController.DeleteTicket);

module.exports = ticketManageRouter;