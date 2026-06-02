const express = require("express");
const painChiefComplaintRouter = express.Router();
const {
  createPatientPainChiefComplaint,
  getPainChiefComplaint,
  updatePainChiefComplaint,
  deletePainChiefComplaint,
} = require("../../../controllers/OPD/Patient/pain_chiefComplaint");
const { handleToken } = require("../../../utils/handleToken");

painChiefComplaintRouter.post(
  "/",
  handleToken,
  createPatientPainChiefComplaint
);
painChiefComplaintRouter.get("/:patientId", handleToken, getPainChiefComplaint);
painChiefComplaintRouter.delete(
  "/delete/:id",
  handleToken,
  deletePainChiefComplaint
);
painChiefComplaintRouter.put(
  "/edit/:patientId",
  handleToken,
  updatePainChiefComplaint
);

module.exports = painChiefComplaintRouter;
