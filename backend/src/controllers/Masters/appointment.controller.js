const { AppointmentSchedulingModel } = require('../../models')
const { ConsultantModel, EmployeeModel, AdminModel } = require('../../models')
const { validationResult } = require('express-validator')
const DepartmentSetupModel = require('../../models/departmentSetup.model')
const httpStatus = require('http-status')
const mongoose = require('mongoose')

const createAppointmentScheduling = async (req, res) => {
  try {
    const userId = req.user.adminId
    const user = await AdminModel.findById({ _id: userId })
    if (user.role == 'admin') {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ errors: errors.array() })
      }
      const { departmentName } = req.body
      req.body.user = req.user.branchId
      const department = await DepartmentSetupModel.findOne({ departmentName })

      if (!department) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ error: 'Department not found' })
      }

      const newAppointment = new AppointmentSchedulingModel({
        ...req.body,
        departmentId: department._id
      })

      const savedAppointment = await newAppointment.save()
      return res.status(httpStatus.CREATED).json(savedAppointment)
    } else if (user.role == 'doctor') {
      console.log('1')
      const existingdoctor = await ConsultantModel.findOne({
        _id: req.user.branchId
      })
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ errors: errors.array() })
      }
      const { departmentName } = req.body
      req.body.user = existingdoctor.basicDetails.user
      const department = await DepartmentSetupModel.findOne({ departmentName })

      if (!department) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ error: 'Department not found' })
      }

      const newAppointment = new AppointmentSchedulingModel({
        ...req.body,
        departmentId: department._id
      })

      const savedAppointment = await newAppointment.save()
      console.log('savedAppointment', savedAppointment)

      return res.status(httpStatus.CREATED).json(savedAppointment)
    } else if (user.role !== 'admin' && user.role !== 'doctor') {
      const existingEmployee = await EmployeeModel.findOne({
        _id: req.user.branchId
      })
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ errors: errors.array() })
      }
      const { departmentName } = req.body
      req.body.user = existingEmployee.basicDetails.user
      const department = await DepartmentSetupModel.findOne({ departmentName })

      if (!department) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ error: 'Department not found' })
      }

      const newAppointment = new AppointmentSchedulingModel({
        ...req.body,
        departmentId: department._id
      })

      const savedAppointment = await newAppointment.save()
      return res.status(httpStatus.CREATED).json(savedAppointment)
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}

const getAllAppointmentSchedulings = async (req, res) => {
  try {
    const appointmentSchedulings = await AppointmentSchedulingModel.find({
      delete: false
    })
    res.status(httpStatus.OK).json({ data: appointmentSchedulings })
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}

const getAppointmentSchedulingById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.adminId
    const appointmentScheduling = await AppointmentSchedulingModel.findById({
      _id: id,
      user: userId
    })
    if (!appointmentScheduling) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Appointment scheduling not found' })
    }
    res.status(httpStatus.OK).json({ data: appointmentScheduling })
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}

const updateAppointmentScheduling = async (req, res) => {
  try {
    const { id } = req.params
    if (!id || !req.body) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Invalid ID or request body' })
    }
    const updatedAppointmentScheduling =
      await AppointmentSchedulingModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      })

    if (!updatedAppointmentScheduling) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Appointment scheduling not found' })
    }

    res.status(httpStatus.OK).json({
      msg: 'Updated Successfully!',
      data: updatedAppointmentScheduling
    })
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}

const deleteAppointmentScheduling = async (req, res) => {
  try {
    const { id } = req.params
    const deletedAppointmentScheduling =
      await AppointmentSchedulingModel.findByIdAndUpdate(
        { _id: id },
        { ...req.body, delete: true, deletedAt: Date.now(), new: true }
      )
    if (!deletedAppointmentScheduling) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Appointment scheduling not found' })
    }
    res.status(httpStatus.OK).json({ msg: 'Deleted Successfully!!' })
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}

const bulkImport = async (req, res) => {
  try {
    const party = req.body
    const result = await AppointmentSchedulingModel.insertMany(party)
    res
      .status(httpStatus.CREATED)
      .json({ msg: 'Appointment booked successfully', data: result })
  } catch (error) {
    console.error(error)
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' })
  }
}

// const checkConsultantIsAvailableOrNot = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const today = new Date().toISOString().split("T")[0];

//     const consultantScheduling = await AppointmentSchedulingModel.findOne({
//       doctorId: id,
//     });

//     if (!consultantScheduling) {
//       return res.status(404).json({ message: "Consultant schedule not found" });
//     }

//     const todaySchedule = consultantScheduling.schedule.find(
//       (day) => day.date === today && day.selected === true
//     );

//     if (todaySchedule) {
//       return res.json({
//         available: true,
//         schedule: {
//           ...todaySchedule,
//           timeInterval: consultantScheduling.timeInterval,
//           consultantScheduling,
//         },
//       });
//     } else {
//       return res.json({
//         available: false,
//         message: "Consultant is not available today",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const checkConsultantIsAvailableOrNot = async (req, res) => {
  try {
    const { id } = req.params
    let { date } = req.query // Get the date from query params
   
    // Validate if `id` is a proper ObjectId
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ message: 'Invalid doctorId format' });
    // }

    const objId = new mongoose.Types.ObjectId(id) // Convert valid id to ObjectId

    // If no date is passed, use the current date
    date = date
      ? new Date(date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]

    const consultantScheduling = await AppointmentSchedulingModel.findOne({
      doctorId: objId,
      delete: false
    })

    if (!consultantScheduling) {
      return res.status(404).json({ message: 'Consultant schedule not found' })
    }

    // Find the schedule for the given date
    const todaySchedule = consultantScheduling.schedule.find(
      day => day.date === date && day.selected === true
    )

    if (todaySchedule) {
      return res.json({
        available: true,
        schedule: {
          ...todaySchedule,
          timeInterval: consultantScheduling.timeInterval,
          consultantScheduling
        }
      })
    } else {
      return res.json({
        available: false,
        message: 'Consultant is not available today'
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

const getValidAndInvalidRowsData = async (req, res) => {
  const { id } = req.params
  const validAndInvalidRecords = {}

  const scheduleRecordData = await AppointmentSchedulingModel.findById(id)
  scheduleRecordData.schedule.forEach(entry => {
    validAndInvalidRecords[entry.id] = entry.selected
  })

  return res.status(200).json({success : true,  validAndInvalidRecords : validAndInvalidRecords })
}

const getValidAndInvalidDataOfSlotA = async (req, res) => {
  const { id } = req.params
  const validAndInvalidRecords = {}

  const scheduleRecordData = await AppointmentSchedulingModel.findById(id)
  scheduleRecordData.schedule.forEach(entry => {
    validAndInvalidRecords[entry.id] = entry.slotA.selected
  })

  return res.status(200).json({success : true,  validAndInvalidRecords : validAndInvalidRecords })
}


module.exports = {
  createAppointmentScheduling,
  getAllAppointmentSchedulings,
  getAppointmentSchedulingById,
  updateAppointmentScheduling,
  deleteAppointmentScheduling,
  bulkImport,
  checkConsultantIsAvailableOrNot,
  getValidAndInvalidRowsData,
  getValidAndInvalidDataOfSlotA
}
