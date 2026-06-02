const express=require("express");
const TreatmentSheet=express.Router();

const { getTreatmentSheet, createTreatmentSheet, updateTreatmentSheet, deleteTreatmentSheet } = require('../../controllers/ipd-form-setup/treatmentSheet.controller')


TreatmentSheet.get('/', getTreatmentSheet)
TreatmentSheet.post('/', createTreatmentSheet)
TreatmentSheet.put('/:id', updateTreatmentSheet)
TreatmentSheet.delete('/:id', deleteTreatmentSheet)


module.exports=TreatmentSheet
