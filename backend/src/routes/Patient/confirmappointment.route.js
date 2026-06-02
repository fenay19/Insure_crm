const express = require('express');
const confirmAppointmentRouter = express.Router();
const { confirmappointmentController } = require('../../controllers');
const {handleToken} = require('../../utils/handleToken'); 

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/images'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage: storage });


confirmAppointmentRouter.post("/",upload.fields([
    { name: 'aadhar_card', maxCount: 1 },
    { name: 'abha_card', maxCount: 1 }
  ]), handleToken, confirmappointmentController.createConfirmAppointment),

confirmAppointmentRouter.get("/", handleToken, confirmappointmentController.getAllConfirmedAppointments),
confirmAppointmentRouter.put("/delete/:id", handleToken, confirmappointmentController.deletePatient),

confirmAppointmentRouter.get("/patient-details", handleToken, confirmappointmentController.getPatientDetails),

confirmAppointmentRouter.post("/patient-details",upload.fields([
  { name: 'aadhar_card', maxCount: 1 },
  { name: 'abha_card', maxCount: 1 }
]), handleToken, confirmappointmentController.createPatientDetails),



module.exports = confirmAppointmentRouter