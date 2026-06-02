const { Router } = require("express");
const vitalMasterRoute = Router();
const { handleToken } = require("../../../../utils/handleToken");
const {
  createVitals,
  getAllVitals,
  deleteVitals,
  updateVitals,
} = require("../../../../controllers/Masters/clinical-setup/vitals-master/vitals.controller");

vitalMasterRoute.route("/").post(handleToken, createVitals);
vitalMasterRoute.route("/").get(handleToken, getAllVitals);
vitalMasterRoute.route("/edit/:id").put(handleToken, updateVitals);
vitalMasterRoute.route("/delete/:id").put(handleToken, deleteVitals);
module.exports = vitalMasterRoute;
