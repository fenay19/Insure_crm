const express = require('express');
const EmergencyRouter = express.Router();
const { 
  CreateEmergencyDetail, 
  getAllEmergencyRegisteration, 
  updateEmergencyRegistation,
  emergencyLive,
} = require('../../controllers/Emergency/emergencyRegisteration.controller');

EmergencyRouter.post('/', CreateEmergencyDetail);

EmergencyRouter.get('/', getAllEmergencyRegisteration);

EmergencyRouter.put('/:id', updateEmergencyRegistation);

EmergencyRouter.get('/live',emergencyLive)

module.exports = EmergencyRouter;
