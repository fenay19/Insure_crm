const PatientAppointment = require("../../models/Masters/patientAppointment.model");
const {AppointmentSchedulingModel} = require('../../models')

// Create a new patient appointment
const createAppointment = async (req, res) => {
  try {
    const newAppointment = new PatientAppointment(req.body);
    const savedAppointment = await newAppointment.save();

    // Find the doctor's schedule
    const ScheduleOfDoctor = await AppointmentSchedulingModel.findOne({
      doctorId: savedAppointment.consultantId,
    });

    if (!ScheduleOfDoctor) {
      return res.status(404).json({ success : false, message: "Doctor schedule not found" });
    }

    // Find the specific day's schedule
    const getPerticularDaySchedule = ScheduleOfDoctor.schedule.find(
      (item) => item.date === savedAppointment.date
    );

    if (!getPerticularDaySchedule) {
      return res.status(404).json({ success : false, message: "Day schedule not found" });
    }

    // Function to update the time slot status
    const updateTimeSlotStatus = (slot, time) => {
      const timeSlot = slot.timeSlotsIntervalWise.find(
        (ts) => ts.time === time
      );

      console.log(timeSlot)

      if (timeSlot) {
        timeSlot.booked = true
        timeSlot.status = "APPOINTMENT BOOKED";
      }
    };

    // Update the status in slotA or slotB based on the appointment time
    const appointmentTime = savedAppointment.time; // Assuming this is in the format "HH:MM AM/PM"
    updateTimeSlotStatus(getPerticularDaySchedule.slotA, appointmentTime);
    updateTimeSlotStatus(getPerticularDaySchedule.slotB, appointmentTime);

    // Mark the schedule as modified
    ScheduleOfDoctor.markModified("schedule");

    // Save the updated schedule back to the database
    await ScheduleOfDoctor.save();

    res.status(201).json({
      success : true,
      message: "Appointment created successfully",
      data: savedAppointment,
    });
  } catch (error) {
    res.status(400).json({  success : false, message: "Error creating appointment", error });
  }
};
// Get all patient appointments{
const getAllAppointments = async (req, res) => {
  try {
    // Get the current date in UTC (midnight at the start of the day)
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to midnight (start of the day)

    // Convert the current date to UTC to ensure the comparison is consistent
    const currentUTC = new Date(currentDate.toISOString());

    const appointments = await PatientAppointment.find({
      isConfirm: false,
      createdAt: { $gte: currentUTC }, // Compare with UTC date
    })
      .populate("prefixId departmentId consultantId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await PatientAppointment.find()
      .populate("prefixId departmentId consultantId")
      .sort({ createdAt: -1 });
    res.status(200).json({
      message: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// Get a single patient appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await PatientAppointment.findById(id).populate(
      "prefixId departmentId consultantId"
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res
      .status(200)
      .json({ message: "Appointment fetched successfully", data: appointment });
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointment", error });
  }
};

// Update an existing patient appointment
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAppointment = await PatientAppointment.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({
      message: "Appointment updated successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating appointment", error });
  }
};

// Delete a patient appointment
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAppointment = await PatientAppointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment", error });
  }
};

//get appointments on daily basis
const getDailyAppointmentNumber = async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const appointments = await PatientAppointment.find({
    createdAt: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  });

  return res.status(200).json({
    success: true,
    data: appointments?.length,
    appointments: appointments,
  });
};

// const getDailyAppointments = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const todayDate = moment().format("YYYY-MM-DD"); // Get today's date in 'YYYY-MM-DD' format

//     // Fetch records where consultantId matches & patientId.date is today
//     const appointments = await OpdPatientModel.find({ consultantId: id })
//       .populate("patientId")
//       .exec();

//     // Filter records based on today's date
//     const filteredAppointments = appointments.filter(
//       (appointment) => appointment.patientId?.date === todayDate
//     );

//     console.log(filteredAppointments);

//     return res.status(200).json({
//       success: true,
//       count: filteredAppointments.length,
//       data: filteredAppointments,
//     });
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     return res.status(500).json({
//       success: false,
//       msg: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointments,
  getDailyAppointmentNumber,
};
