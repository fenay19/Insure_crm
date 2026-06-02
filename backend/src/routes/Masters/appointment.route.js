const express = require('express')
const appointmentSchedulingRouter = express.Router()
const { appointmentSchedulingController } = require('../../controllers')
const {
  validateApointment
} = require('../../validations/Masters/apointment.validations')
const { handleToken } = require('../../utils/handleToken')

appointmentSchedulingRouter.post(
  '/',
  handleToken,
  appointmentSchedulingController.createAppointmentScheduling
)

appointmentSchedulingRouter.post(
  '/import',
  handleToken,
  appointmentSchedulingController.bulkImport
)

appointmentSchedulingRouter.get(
  '/',
  handleToken,
  appointmentSchedulingController.getAllAppointmentSchedulings
)

appointmentSchedulingRouter.get(
  '/:id',
  handleToken,
  appointmentSchedulingController.getAppointmentSchedulingById
)

appointmentSchedulingRouter.put(
  '/:id',
  handleToken,
  appointmentSchedulingController.updateAppointmentScheduling
)

appointmentSchedulingRouter.put(
  '/delete/:id',
  handleToken,
  appointmentSchedulingController.deleteAppointmentScheduling
)
appointmentSchedulingRouter.get(
  '/getData/checkConsultantAvailableOrNot/:id',
  
  appointmentSchedulingController.checkConsultantIsAvailableOrNot
)

appointmentSchedulingRouter.get(
  '/getData/getValidAndInvalidRowsData/:id',
  appointmentSchedulingController.getValidAndInvalidRowsData
)


appointmentSchedulingRouter.get(
  '/getData/getValidAndInvalidDataOfSlotA/:id',
  appointmentSchedulingController.getValidAndInvalidDataOfSlotA
)



module.exports = appointmentSchedulingRouter
