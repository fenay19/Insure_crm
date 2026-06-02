const express = require("express");
const {PatientExaminationController} = require("../../../controllers");
const PatientExaminationRoutes = express.Router();
const {handleToken} = require('../../../utils/handleToken');

PatientExaminationRoutes.post('/',handleToken,PatientExaminationController.createPatientExamination);
PatientExaminationRoutes.put('/:id',handleToken,PatientExaminationController.updatePatientExamination);
PatientExaminationRoutes.get('/:id',handleToken,PatientExaminationController.getAllPatientExamination);
PatientExaminationRoutes.get('/examination/:consultantId/:opdPatientId', PatientExaminationController.getPatientExaminationByConsultantAndPatient)

module.exports = PatientExaminationRoutes