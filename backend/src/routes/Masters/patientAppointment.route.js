const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointments,
  getDailyAppointmentNumber
} = require("../../controllers/Masters/patientAppointment.controller");

const express = require("express");
const PatientAppointRouter = express.Router();

PatientAppointRouter.post("/", createAppointment);
PatientAppointRouter.get("/", getAllAppointments);
PatientAppointRouter.get("/all", getAppointments);
PatientAppointRouter.get("/:id", getAppointmentById);
PatientAppointRouter.put("/:id", updateAppointment);
PatientAppointRouter.delete("/delete/:id", deleteAppointment);
PatientAppointRouter.get('/opd/getDailyAppoitments', getDailyAppointmentNumber)

module.exports = PatientAppointRouter;
