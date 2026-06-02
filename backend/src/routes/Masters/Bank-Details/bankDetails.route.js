const express = require("express");
const bankDetailsRouter = express.Router();

const { handleToken } = require('../../../utils/handleToken')

const {
  getBankDetailsController,
  postBankDetailsController,
  putBankDetailsController,
  deleteBankDetailsController,
} = require("../../../controllers/Masters/Banking-Details/bankingDetails.controller");

// Route to get all banking details
bankDetailsRouter.get("/", handleToken, getBankDetailsController);
// Route to create new banking details
bankDetailsRouter.post("/", handleToken, postBankDetailsController);

// Route to update banking details by ID
bankDetailsRouter.put("/:id", handleToken, putBankDetailsController);

// Route to delete banking details by ID
bankDetailsRouter.delete("/:id", handleToken, deleteBankDetailsController);

module.exports = bankDetailsRouter;
