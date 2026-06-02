const express = require("express");

const OPDReceiptRouter = express.Router();
const { handleToken } = require("../../utils/handleToken");

const { OPDReciptController } = require("../../controllers");

OPDReceiptRouter.post(
  "/add",
  handleToken,
  OPDReciptController.createOPDReceipt
);
OPDReceiptRouter.get(
  "/latestOPDReceiptNo",
  OPDReciptController.getLatestOPDReceiptNo
);
OPDReceiptRouter.get(
  "/getOpdReceipts/:id",
  OPDReciptController.getAllGeneratedReceiptsAgainstOPDPatient
);
OPDReceiptRouter.get(
  "/getAllReceipts",
  OPDReciptController.getAllReceipts
);

OPDReceiptRouter.get(
  "/daily",
  OPDReciptController.getAllOpdReceiptsCurrentDate
);

module.exports = OPDReceiptRouter;
