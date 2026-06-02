const { UHID_MRN_NAME_Controller } = require("../../controllers");
const express = require("express");
const UHID_MRN_NAMERouter = express.Router();
const {handleToken} = require('../../utils/handleToken'); 

UHID_MRN_NAMERouter.post("/", handleToken,UHID_MRN_NAME_Controller.createName);
UHID_MRN_NAMERouter.get("/", handleToken,UHID_MRN_NAME_Controller.getAllName);
UHID_MRN_NAMERouter.put("/:id", handleToken,UHID_MRN_NAME_Controller.UpadteAllName);

module.exports = UHID_MRN_NAMERouter;