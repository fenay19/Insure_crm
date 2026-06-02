const { Router } = require("express");
const findingOptionRouter = Router();
const { handleToken } = require("../../../../utils/handleToken");
const {
 createFindingOption,deleteFindingOption,getAllFindingOptions
} = require("../../../../controllers/OPD/Examination/opthalmology/findingOptions");

findingOptionRouter.post("/", handleToken, createFindingOption);
findingOptionRouter.delete("/delete", handleToken, deleteFindingOption);
findingOptionRouter.get("/", handleToken, getAllFindingOptions);

module.exports = findingOptionRouter;
