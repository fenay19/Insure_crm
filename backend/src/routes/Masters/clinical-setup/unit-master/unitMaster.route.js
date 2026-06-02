const { Router } = require("express");
const unitMasterRouter = Router();
const { handleToken } = require("../../../../utils/handleToken");
const {
  createUnit,
  getAllUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
} = require("../../../../controllers/Masters/clinical-setup/unit-master/unitMaster.controller");

unitMasterRouter.route("/units").post(handleToken, createUnit);
unitMasterRouter.route("/units").get(handleToken, getAllUnits);
unitMasterRouter.route("/units/:id").get(handleToken, getUnitById);
unitMasterRouter.route("/units/edit/:id").put(handleToken, updateUnit);
unitMasterRouter.route("/units/delete/:id").put(handleToken, deleteUnit);
module.exports = unitMasterRouter;
