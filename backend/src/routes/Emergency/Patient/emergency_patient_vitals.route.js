const express = require("express");
const { EmergencyPatientVitalsController } = require("../../../controllers")
const { handleToken } = require('../../../utils/handleToken');
const EmergencyPatientVitalsRoutes = express.Router();

EmergencyPatientVitalsRoutes.post('/', handleToken, EmergencyPatientVitalsController.createEmergencyPatientVitalsController)
EmergencyPatientVitalsRoutes.get('/:id', handleToken, EmergencyPatientVitalsController.getEmergencyPatientVitalsController)
EmergencyPatientVitalsRoutes.put('/:id', handleToken, EmergencyPatientVitalsController.updateEmergencyPatientVitalsController)


module.exports = EmergencyPatientVitalsRoutes