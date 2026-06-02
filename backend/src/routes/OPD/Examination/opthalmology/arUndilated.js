const { Router } = require("express");
const undilatedOptionRouter = Router();
const { handleToken } = require("../../../../utils/handleToken");

const {
 
  createArUndilatedOption,
  deleteArUndilatedOption,
  getAllArUndilatedOptions
} = require("../../../../controllers/OPD/Examination/opthalmology/arUndilated");

undilatedOptionRouter.post("/", handleToken, createArUndilatedOption);
undilatedOptionRouter.delete("/delete", handleToken, deleteArUndilatedOption);
undilatedOptionRouter.get("/", handleToken, getAllArUndilatedOptions);

module.exports = undilatedOptionRouter;
