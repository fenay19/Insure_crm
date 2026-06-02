const express = require('express');
const bookAppointmentRouter = express.Router();
const { bookappointmentController } = require('../../controllers');
const {handleToken} = require('../../utils/handleToken'); 

bookAppointmentRouter.get("/", handleToken, bookappointmentController.getAppointment),
bookAppointmentRouter.post("/", handleToken, bookappointmentController.createAppointment),
bookAppointmentRouter.put("/:id", handleToken, bookappointmentController.deleteAppointment),
bookAppointmentRouter.get("/all", handleToken, bookappointmentController.getAppointmentAll),

module.exports = bookAppointmentRouter