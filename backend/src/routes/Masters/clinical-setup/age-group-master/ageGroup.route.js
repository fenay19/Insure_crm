const { Router } = require("express");
const ageGroupRouter = Router();
const { handleToken } = require("../../../../utils/handleToken");
const {
  createAgeGroup,
  deleteAgeGroup,
  getAgeGroupById,
  getAllAgeGroups,
  updateAgeGroup,
} = require("../../../../controllers/Masters/clinical-setup/ageGroup.controller");

ageGroupRouter.route("/").post(handleToken, createAgeGroup);
ageGroupRouter.route("/").get(handleToken, getAllAgeGroups);
ageGroupRouter.route("/delete/:id").put(handleToken, deleteAgeGroup);
ageGroupRouter.route("/edit/:id").put(handleToken, updateAgeGroup);

module.exports = ageGroupRouter;
