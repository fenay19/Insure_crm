const express = require("express");
const paymentModeRouter = express.Router();
const { PaymentModeController } = require("../../controllers");
const {handleToken} = require('../../utils/handleToken'); 

paymentModeRouter.get("/", handleToken, PaymentModeController.getPaymentMode);

paymentModeRouter.post("/", handleToken, PaymentModeController.addPaymentMode);

paymentModeRouter.put("/:id", handleToken, PaymentModeController.updatePaymentMode);

paymentModeRouter.delete("/:id", handleToken, PaymentModeController.deletePaymentMode);

paymentModeRouter.get("/:id", handleToken, PaymentModeController.getPaymentModeById);

module.exports = paymentModeRouter;
