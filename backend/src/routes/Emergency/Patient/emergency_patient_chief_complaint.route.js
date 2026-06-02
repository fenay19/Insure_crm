const express = require("express");
const {EmergencyPatientChiefComplaintController} = require("../../../controllers")
const EmergencyPatientChiefComplaintRoutes = express.Router();

EmergencyPatientChiefComplaintRoutes.post("/", EmergencyPatientChiefComplaintController.createEmergencyPatientChiefComplaint)
EmergencyPatientChiefComplaintRoutes.get("/:id", EmergencyPatientChiefComplaintController.getEmergencyPatientChiefComplaint)
EmergencyPatientChiefComplaintRoutes.put("/:id", EmergencyPatientChiefComplaintController.updateEmergencyPatientChiefComplaint)

module.exports = EmergencyPatientChiefComplaintRoutes