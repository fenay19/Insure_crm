const express = require("express");
const financialYearRouter = express.Router();
const { financialYearControllers } = require("../../../controllers/index");
const { handleToken } = require("../../../utils/handleToken");

financialYearRouter.get(
  "/",
  financialYearControllers.getFinancialYearController
);
financialYearRouter.post(
  "/",
  financialYearControllers.postFinancialYearController
);
financialYearRouter.put(
  "/:id",
  financialYearControllers.putFinancialYearController
);
financialYearRouter.delete(
  "/:id",
  financialYearControllers.deleteFinancialYearController
);

module.exports = financialYearRouter;
