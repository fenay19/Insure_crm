const { Router } = require("express");
const dilatedOptionRouter = Router();
const { handleToken } = require("../../../../utils/handleToken");

const {
  createDilatedOption,
  deleteDilatedOption,
  getAllDilatedOptions,
  
} = require("../../../../controllers/OPD/Examination/opthalmology/arDilated");

dilatedOptionRouter.post("/", handleToken, createDilatedOption);
dilatedOptionRouter.delete("/delete", handleToken, deleteDilatedOption);
dilatedOptionRouter.get("/", handleToken, getAllDilatedOptions);

module.exports = dilatedOptionRouter;
