const express = require('express');
const EmergencyPatientMedicalPrescriptionRoutes = express.Router();
const {
    createPatientMedicalPrescription,
    updatePatientMedicalPrescription,
    getAllPatientMedicalPrescription,
    getOldPrescription,
  } = require('../../../controllers/Emergency/Patient/emergency_patient_medical_prescription.controller');
const {handleToken} = require('../../../utils/handleToken');

EmergencyPatientMedicalPrescriptionRoutes.post('/',handleToken,createPatientMedicalPrescription);
EmergencyPatientMedicalPrescriptionRoutes.put('/:id',handleToken,updatePatientMedicalPrescription);
EmergencyPatientMedicalPrescriptionRoutes.get('/:id',handleToken,getAllPatientMedicalPrescription);
EmergencyPatientMedicalPrescriptionRoutes.get('/old-prescription/:patientId/:consultantId', handleToken, getOldPrescription)

module.exports = EmergencyPatientMedicalPrescriptionRoutes