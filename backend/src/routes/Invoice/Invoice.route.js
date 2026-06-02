const express = require("express");
const InvoiceRouter = express.Router();
const { InvoiceRegistrationController } = require("../../controllers/index");
const { handleToken } = require("../../utils/handleToken");

InvoiceRouter.get(
  "/cardsInfo",
  handleToken,
  InvoiceRegistrationController.cardsInfo
);

InvoiceRouter.get(
  "/",
  handleToken,
  InvoiceRegistrationController.getAllInvoice
);
InvoiceRouter.get(
  "/status",
  InvoiceRegistrationController.getMonthlyInvoiceSummary
);
InvoiceRouter.post(
  "/",
  handleToken,
  InvoiceRegistrationController.createInvoice
);
InvoiceRouter.delete(
  "/:id",
  handleToken,
  InvoiceRegistrationController.deleteInvoice
);
InvoiceRouter.get(
  "/:id",
  handleToken,
  InvoiceRegistrationController.getInvoiceById
);
InvoiceRouter.put(
  "/:id",
  handleToken,
  InvoiceRegistrationController.updateInvoice
);

// Delete specific payment history entry from an invoice
InvoiceRouter.delete(
  "/:invoiceId/history/:historyId",
  handleToken,
  InvoiceRegistrationController.deleteInvoiceHistory
);

InvoiceRouter.post(
  "/cards/value",
  handleToken,
  InvoiceRegistrationController.InvoiceCardsValue
);

InvoiceRouter.post(
  "/daily",
  handleToken,
  InvoiceRegistrationController.getInvoicesPerDay
);

InvoiceRouter.post(
  "/monthly",
  handleToken,
  InvoiceRegistrationController.getInvoicesPerMonth
);

InvoiceRouter.post(
  "/daily-value",
  handleToken,
  InvoiceRegistrationController.getDailyInvoiceValue
);

InvoiceRouter.post(
  "/monthly-value",
  handleToken,
  InvoiceRegistrationController.getMonthlyInvoiceValue
);

InvoiceRouter.post(
  "/status-summary",
  handleToken,
  InvoiceRegistrationController.getInvoiceStatusSummary
);

InvoiceRouter.post(
  "/revenue-summary",
  handleToken,
  InvoiceRegistrationController.getMonthlyRevenue
);

module.exports = InvoiceRouter;
