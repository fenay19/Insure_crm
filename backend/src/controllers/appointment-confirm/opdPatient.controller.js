// const OpdPatientModel = require("../../models/appointment-confirm/opdPatient.model");
// const UHID = require("../../models/UHID.model");
// const PatientDetails = require("../../models/Masters/patientAppointment.model");
// const AdminModel = require("../../models/admin.model");
// const ConsultantModel = require("../../models/Staffs/consultants/consultants.model");
// const EmployeeModel = require("../../models/Staffs/employee/employee.model");
// const OpdReceiptsModel = require("../../models/OPDBillReceipts/OPDBillReceipt.model");
// const mongoose = require("mongoose");
// const generateUHID = require("../../utils/generateUhid/generateuhid");
// const { AppointmentSchedulingModel } = require("../../models");

// const moment = require("moment");
// const { emitPatientStatusUpdate } = require("../../utils/socket");

// // let uhidId;
// // const generateUHID = async (uhidNo) => {
// //   try {
// //     const newUHIDDocument = new UHID({ uhid: uhidNo });
// //     uhidId = await newUHIDDocument.save();
// //     return uhidNo;
// //   } catch (error) {
// //     console.error("Error in generateUHID:", error);
// //     throw error;
// //   }
// // };
// // const generateUHID = async (uhidNo) => {
// //   try {
// //     // const lastEntry = await UHID.findOne().sort({ createdAt: -1 });
// //     // const currentDate = new Date();
// //     // const year = currentDate.getFullYear();
// //     // const month = String(currentDate.getMonth() + 1).padStart(2, "0");
// //     // const date = String(currentDate.getDate()).padStart(2, "0");

// //     // let newSerialNumber;

// //     // if (lastEntry && lastEntry.uhid) {
// //     //   const parts = lastEntry.uhid.split("-");

// //     //   if (parts.length === 2) {
// //     //     const lastSerial = parts[1];

// //     //     newSerialNumber = (parseInt(lastSerial, 10) + 1)
// //     //       .toString()
// //     //       .padStart(7, "0");
// //     //   } else {
// //     //     newSerialNumber = "0000001";
// //     //   }
// //     // } else {
// //     //   newSerialNumber = "0000001";
// //     // }

// //     // const newUHID = `${year}${month}${date}-${newSerialNumber}`;
// //     const newUHIDDocument = new UHID({ uhid: uhidNo });
// //     uhidId = await newUHIDDocument.save();

// //     return uhidNo;
// //   } catch (error) {
// //     console.error("Error in generateUHID:", error);
// //     throw error;
// //   }
// // };

// const generateRegistrationNumber = async () => {
//   const year = new Date().getFullYear(); // Current year
//   const lastEntry = await OpdPatientModel.findOne()
//     .sort({ createdAt: -1 }) // Sort by most recent
//     .select("opd_regNo"); // Select only the opd_regNo field

//   let newSerialNumber;

//   if (lastEntry && lastEntry.opd_regNo) {
//     // Extract the serial number from the last opd_regNo
//     const parts = lastEntry.opd_regNo.split("-");
//     const lastSerial = parts[2]; // The third part contains the serial number

//     if (!isNaN(lastSerial)) {
//       // Increment the last serial number
//       newSerialNumber = (parseInt(lastSerial, 10) + 1)
//         .toString()
//         .padStart(5, "0");
//     } else {
//       throw new Error("Invalid opd_regNo format in the database.");
//     }
//   } else {
//     // No entries found in the database, start with the first serial number
//     newSerialNumber = "00001";
//   }

//   // Construct the new registration number
//   return `OPD-${year}-${newSerialNumber}`;
// };

// const getUhidAndRegNo = async (req, res) => {
//   try {
//     const lastUhid = await UHID.findOne().sort({ createdAt: -1 });
//     const lastReg = await OpdPatientModel.findOne()
//       .sort({ createdAt: -1 })
//       .select("opd_regNo");
//     res.json({
//       data: {
//         uhid: lastUhid,
//         reg: lastReg,
//       },
//     });
//   } catch (err) {}
// };

// const CreateRegistrationDetail = async (req, res) => {
//   console.log("CreateRegistrationDetail");
//   try {
//     const userId = req.user?.adminId;
//     const user = await AdminModel.findOne({ _id: userId });
//     const formType = req.body.formType;

//     if (!formType) {
//       return res.status(400).json({ message: "Form type is required" });
//     }

//     let whoBookId, whoBookName;
//     let aadharCardFile = null;
//     let abhaCardFile = null;
//     let cardAttachmentFile = null;
//     let charityDocumentFile = null;

//     if (req.files && req.files["aadhar_card"] && req.files["aadhar_card"][0]) {
//       aadharCardFile = req.files["aadhar_card"][0].filename;
//     }

//     if (req.files && req.files["abha_card"] && req.files["abha_card"][0]) {
//       abhaCardFile = req.files["abha_card"][0].filename;
//     }

//     if (
//       req.files &&
//       req.files["cardAttachment"] &&
//       req.files["cardAttachment"][0]
//     ) {
//       cardAttachmentFile = req.files["cardAttachment"][0].filename;
//     }

//     if (
//       req.files &&
//       req.files["charityDocument"] &&
//       req.files["charityDocument"][0]
//     ) {
//       charityDocumentFile = req.files["charityDocument"][0].filename;
//     }

//     if (user?.role === "admin") {
//       req.body.user = user?.refId;
//       whoBookId = user?.refId;
//       whoBookName = user?.name;
//     } else if (user?.role === "doctor") {
//       const doctor = await ConsultantModel.findOne({ _id: user?.refId });
//       req.body.user = doctor?.basicDetails.user;
//       whoBookId = user?.refId;
//       whoBookName = user?.name;
//     } else {
//       const employee = await EmployeeModel.findOne({ _id: user?.refId });
//       req.body.user = employee?.basicDetails.user;
//       whoBookId = user?.refId;
//       whoBookName = user?.name;
//     }

//     if (!req.body.patientId) {
//       return res.status(400).json({ message: "Patient ID is required" });
//     }

//     const defaultValues = {
//       whoBookId,
//       whoBookName,
//       delete: false,
//     };

//     // Handle tpaId and prefixId
//     let tpaId = req.body.tpaId || null; // Set to null if tpaId is falsy
//     let prefixId = req.body.relativePrifixId || null; // Set to null if relativePrifixId is falsy

//     const newRegDetail = new OpdPatientModel({
//       ...defaultValues,
//       aadhar_card: aadharCardFile,
//       abha_card: abhaCardFile,
//       cardAttachment: cardAttachmentFile,
//       uhid: req?.body?.uhidNo,
//       ...req.body,
//       tpaId: tpaId,
//       relativePrifixId: prefixId,
//       charityDocument: charityDocumentFile,
//     });

//     const savedData = await newRegDetail.save();
//     await generateUHID(req?.body?.uhidNo);

//     // Find the doctor's schedule
//     const ScheduleOfDoctor = await AppointmentSchedulingModel.findOne({
//       doctorId: savedData.consultantId,
//     });

//     if (!ScheduleOfDoctor) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Doctor schedule not found" });
//     }

//     // Find the specific day's schedule
//     const getPerticularDaySchedule = ScheduleOfDoctor.schedule.find(
//       (item) => item.date === savedData.date
//     );

//     if (!getPerticularDaySchedule) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Day schedule not found" });
//     }

//     // Function to update the time slot status
//     const updateTimeSlotStatus = (slot, time) => {
//       const timeSlot = slot.timeSlotsIntervalWise.find(
//         (ts) => ts.time === time
//       );

//       if (timeSlot) {
//         timeSlot.booked = true;
//         timeSlot.status = "BOOKED BUT NOT PAID";
//       }
//     };

//     const appointmentTime = savedData.time; // Assuming this is in the format "HH:MM AM/PM"
//     updateTimeSlotStatus(getPerticularDaySchedule.slotA, appointmentTime);
//     updateTimeSlotStatus(getPerticularDaySchedule.slotB, appointmentTime);

//     // Mark the schedule as modified
//     ScheduleOfDoctor.markModified("schedule");

//     // Save the updated schedule back to the database
//     await ScheduleOfDoctor.save();

//     return res.status(201).json({
//       message: `${formType} registration created successfully`,
//       patientRegistration: newRegDetail,
//     });
//   } catch (error) {
//     console.error("Error during CreateRegistrationDetail:", error);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

// const createRegistrationForSpecialCase = async (req, res) => {
//   console.log("createRegistrationForSpecialCase");
//   try {
//     const userId = req.user?.adminId;
//     const user = await AdminModel.findOne({ _id: userId });
//     const formType = req.body.formType;
//     if (!formType)
//       return res.status(400).json({ message: "Form type is required" });
//     // const uhidId = await generateUHID(req.body.uhidNo);
//     // const { uhid } = uhidId;
//     let whoBookId, whoBookName;
//     let aadharCardFile = null;
//     let abhaCardFile = null;
//     let cardAttachmentFile = null;
//     let charityDocumentFile = null;

//     if (req.files && req.files["aadhar_card"] && req.files["aadhar_card"][0]) {
//       aadharCardFile = req.files["aadhar_card"][0].filename;
//     }

//     if (req.files && req.files["abha_card"] && req.files["abha_card"][0]) {
//       abhaCardFile = req.files["abha_card"][0].filename;
//     }
//     if (
//       req.files &&
//       req.files["cardAttachment"] &&
//       req.files["cardAttachment"][0]
//     ) {
//       cardAttachmentFile = req.files["cardAttachment"][0].filename;
//     }
//     if (
//       req.files &&
//       req.files["charityDocument"] &&
//       req.files["charityDocument"][0]
//     ) {
//       charityDocumentFile = req.files["charityDocument"][0].filename;
//     }

//     if (user?.role === "admin") {
//       req.body.user = user?.refId;
//       whoBookId = user?.refId;
//       whoBookName = user?.name;
//     } else if (user?.role === "doctor") {
//       const doctor = await ConsultantModel.findOne({ _id: user?.refId });
//       req.body.user = doctor?.basicDetails.user;
//       whoBookId = user?.refId;
//       whoBookName = user?.name;
//     } else {
//       const employee = await EmployeeModel.findOne({ _id: user?.refId });
//       req.body.user = employee?.basicDetails.user;
//       whoBookId = user?.refId;
//       whoBookName = user?.name;
//     }
//     if (!req.body.patientId) {
//       return res.status(400).json({ message: "Patient ID is required" });
//     }
//     const defaultValues = {
//       // uhid,
//       whoBookId,
//       whoBookName,
//       delete: false,
//     };

//     let tpaId;
//     let prefixId;
//     if (
//       req.body.tpaId?.length === 0 ||
//       req.body.relativePrifixId?.length === 0
//     ) {
//       tpaId = null;
//       prefixId = null;
//     } else {
//       tpaId = req.body.tpaId;
//       prefixId = req.body.relativePrifixId;
//     }
//     const newRegDetail = new OpdPatientModel({
//       ...defaultValues,
//       aadhar_card: aadharCardFile,
//       abha_card: abhaCardFile,
//       cardAttachment: cardAttachmentFile,
//       uhid: req?.body?.uhidNo,
//       ...req.body,
//       tpaId: tpaId,
//       relativePrifixId: prefixId,
//       charityDocument: charityDocumentFile,
//       isPatientPaidTheBill: true,
//     });

//     const savedData = await newRegDetail.save();
//     await generateUHID(req?.body?.uhidNo);

//     const makeAppointmentConfirm = await PatientDetails.findByIdAndUpdate(
//       savedData.patientId,
//       { isConfirm: true },
//       { new: true }
//     );

//     // // Find the doctor's schedule
//     const ScheduleOfDoctor = await AppointmentSchedulingModel.findOne({
//       doctorId: savedData.consultantId,
//     });

//     if (!ScheduleOfDoctor) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Doctor schedule not found" });
//     }

//     // Find the specific day's schedule
//     const getPerticularDaySchedule = ScheduleOfDoctor.schedule.find(
//       (item) => item.date === savedData.date
//     );

//     if (!getPerticularDaySchedule) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Day schedule not found" });
//     }

//     // Function to update the time slot status
//     const updateTimeSlotStatus = (slot, time) => {
//       const timeSlot = slot.timeSlotsIntervalWise.find(
//         (ts) => ts.time === time
//       );

//       if (timeSlot) {
//         timeSlot.booked = true;
//         timeSlot.status = "BOOKED BUT NOT PAID";
//       }
//     };

//     const appointmentTime = savedData.time; // Assuming this is in the format "HH:MM AM/PM"
//     updateTimeSlotStatus(getPerticularDaySchedule.slotA, appointmentTime);
//     updateTimeSlotStatus(getPerticularDaySchedule.slotB, appointmentTime);

//     // // Mark the schedule as modified
//     ScheduleOfDoctor.markModified("schedule");

//     // // Save the updated schedule back to the database
//     await ScheduleOfDoctor.save();
//     emitPatientStatusUpdate(newRegDetail);
//     return res.status(201).json({
//       success: true,
//       message: `${formType} registration  created successfully`,
//       patientRegistration: newRegDetail,
//     });
//   } catch (error) {
//     console.error("Error during CreateRegistrationDetail:", error);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

// const updateRegistrationForSpecialCase = async (req, res) => {
//   try {
//     const userId = req.user?.adminId;
//     const user = await AdminModel.findOne({ _id: userId });
//     const formType = req.body.formType;

//     if (!formType) {
//       return res.status(400).json({ message: "Form type is required" });
//     }

//     const { patientId } = req.body;
//     if (!patientId) {
//       return res.status(400).json({ message: "Patient ID is required" });
//     }

//     let whoBookId, whoBookName;
//     let updatedFields = {};

//     if (req.files?.["aadhar_card"]?.[0]) {
//       updatedFields.aadhar_card = req.files["aadhar_card"][0].filename;
//     }
//     if (req.files?.["abha_card"]?.[0]) {
//       updatedFields.abha_card = req.files["abha_card"][0].filename;
//     }
//     if (req.files?.["cardAttachment"]?.[0]) {
//       updatedFields.cardAttachment = req.files["cardAttachment"][0].filename;
//     }
//     if (req.files?.["charityDocument"]?.[0]) {
//       updatedFields.charityDocument = req.files["charityDocument"][0].filename;
//     }

//     if (user?.role === "admin") {
//       updatedFields.user = user?.refId;
//       whoBookId = user?.refId;
//       whoBookName = user?.name;
//     } else if (user?.role === "doctor") {
//       const doctor = await ConsultantModel.findOne({ _id: user?.refId });
//       updatedFields.user = doctor?.basicDetails.user;
//       whoBookId = user?.refId;
//       whoBookName = user?.name;
//     } else {
//       const employee = await EmployeeModel.findOne({ _id: user?.refId });
//       updatedFields.user = employee?.basicDetails.user;
//       whoBookId = user?.refId;
//       whoBookName = user?.name;
//     }

//     updatedFields.whoBookId = whoBookId;
//     updatedFields.whoBookName = whoBookName;

//     let tpaId = req.body.tpaId?.length === 0 ? null : req.body.tpaId;
//     let prefixId =
//       req.body.relativePrifixId?.length === 0
//         ? null
//         : req.body.relativePrifixId;

//     updatedFields.tpaId = tpaId;
//     updatedFields.relativePrifixId = prefixId;

//     // Update the patient record
//     const updatedRegDetail = await OpdPatientModel.findByIdAndUpdate(
//       patientId,
//       { ...req.body, ...updatedFields },
//       { new: true }
//     );

//     if (!updatedRegDetail) {
//       return res
//         .status(404)
//         .json({ message: "Patient registration not found" });
//     }

//     // Ensure the appointment is confirmed
//     await PatientDetails.findByIdAndUpdate(patientId, { isConfirm: true });

//     // Update the doctor's schedule
//     const ScheduleOfDoctor = await AppointmentSchedulingModel.findOne({
//       doctorId: updatedRegDetail.consultantId,
//     });

//     if (!ScheduleOfDoctor) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Doctor schedule not found" });
//     }

//     const getPerticularDaySchedule = ScheduleOfDoctor.schedule.find(
//       (item) => item.date === updatedRegDetail.date
//     );

//     if (!getPerticularDaySchedule) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Day schedule not found" });
//     }

//     const updateTimeSlotStatus = (slot, time) => {
//       const timeSlot = slot.timeSlotsIntervalWise.find(
//         (ts) => ts.time === time
//       );
//       if (timeSlot) {
//         timeSlot.booked = true;
//         timeSlot.status = "BOOKED BUT NOT PAID";
//       }
//     };

//     const appointmentTime = updatedRegDetail.time;
//     updateTimeSlotStatus(getPerticularDaySchedule.slotA, appointmentTime);
//     updateTimeSlotStatus(getPerticularDaySchedule.slotB, appointmentTime);

//     ScheduleOfDoctor.markModified("schedule");
//     await ScheduleOfDoctor.save();

//     return res.status(200).json({
//       success: true,
//       message: `${formType} registration updated successfully`,
//       patientRegistration: updatedRegDetail,
//     });
//   } catch (error) {
//     console.error("Error during updateRegistrationForSpecialCase:", error);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

// const getAllRegisteration = async (req, res) => {
//   try {
//     const RegData = await OpdPatientModel.find()
//       .sort({ createdAt: -1 })
//       .populate([
//         { path: "requests.radiology" },
//         { path: "requests.pathology" },
//         { path: "requests.otherDiagnostics" },
//         { path: "requests.procedure" },
//         {
//           path: "requests.crossConsultant",
//           populate: {
//             path: "consultant", // field inside PatientCrossConsultationModel
//             populate: {
//               path: "employmentDetails.departmentOrSpeciality",
//               model: "DepartmentSetup", // make sure this matches your model name
//             },
//           },
//         },
//       ]);

//     return res.status(200).json({ data: RegData });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error", error });
//   }
// };
// const getOpdPatientRegistrationById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const data = await OpdPatientModel.findOne({
//       $or: [{ patientId: id }, { _id: id }],
//     });
//     return res.status(200).json({ data });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error", error });
//   }
// };

// const getOpdPatientRegistrationByIdWithToken = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const data = await OpdPatientModel.findById(id);
//     return res.status(200).json({ data });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error", error });
//   }
// };

// const updateRegistation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { patientId, ...updateData } = req.body;
//     console.log("sanham adknhb  ");

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid registration ID" });
//     }

//     if (
//       "relativePrifixId" in updateData &&
//       updateData.relativePrifixId === ""
//     ) {
//       updateData.relativePrifixId = null;
//     }
//     if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
//       return res.status(400).json({ message: "Invalid or missing patient ID" });
//     }

//     const pRegistration = await OpdPatientModel.findById(id);
//     if (!pRegistration) {
//       return res.status(404).json({ message: "Registration not found" });
//     }

//     const patientDetails = await PatientDetails.findById(patientId);
//     if (!patientDetails) {
//       return res.status(404).json({ message: "Patient details not found" });
//     }

//     // Dynamic: Update all matching keys in patientDetails
//     Object.keys(updateData).forEach((key) => {
//       if (patientDetails[key] !== undefined) {
//         patientDetails[key] = updateData[key] === "" ? null : updateData[key];
//       }
//     });

//     await patientDetails.save();

//     // Dynamic: Update registration fields (skip patientId)
//     const registrationData = { ...updateData };
//     delete registrationData.patientId;

//     const updatedRegistration = await OpdPatientModel.findByIdAndUpdate(
//       id,
//       { $set: registrationData },
//       { new: true, runValidators: true }
//     );

//     return res.status(200).json({
//       message: "Registration updated successfully",
//       patientRegistration: updatedRegistration,
//       patientDetails,
//     });
//   } catch (error) {
//     console.error("Error updating registration:", error);
//     return res.status(500).json({ message: "Internal server error", error });
//   }
// };

// const getDailyConfirmedAppointmentConsultantWise = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const todayDate = moment().format("YYYY-MM-DD"); // Get today's date in 'YYYY-MM-DD' format

//     // Fetch records where consultantId matches & patientId.date is today
//     const appointments = await OpdPatientModel.find({
//       $or: [
//         { consultantId: id, isPatientPaidTheBill: true },
//         { payeeCategory: "Insurance" },
//       ],
//     })
//       .populate("patientId")
//       .exec();

//     // Filter records based on today's date
//     const filteredAppointments = appointments.filter(
//       (appointment) => appointment.patientId?.date === todayDate
//     );

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

// const getOpdDashboardData = async (req, res) => {
//   try {
//     let { date } = req.params;

//     // If date is not provided, use the current date
//     if (!date || date === "undefined") {
//       date = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
//     }
//     let filter = {};

//     if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
//       // If the input is a full date (YYYY-MM-DD)
//       filter.date = { $regex: `${date}` };
//     } else if (/^\d{2}$/.test(date)) {
//       // If the input is only a month (MM), find all records where the month matches
//       const currentYear = new Date().getFullYear();
//       const monthPattern = `${currentYear}-${date.padStart(2, "0")}-`; // e.g., "2025-02-"

//       filter.date = { $regex: `^${monthPattern}` }; // Regex to match YYYY-MM-DD where MM matches
//     } else {
//       return res
//         .status(400)
//         .json({ error: "Invalid date format. Use YYYY-MM-DD or MM." });
//     }

//     // Appointments according date and month
//     const allAppointments = await PatientDetails.find(filter);

//     // All PatientIDs
//     const patientIds = allAppointments?.map((data) => data?._id);

//     //  receipts
//     const allOpdReceipts = await OpdReceiptsModel?.find({
//       patientId: { $in: patientIds },
//     });

//     // All Opd Registrations
//     const allOpdRegistration = await OpdPatientModel.find({
//       patientId: { $in: patientIds },
//     });

//     const allOpdRegistrationIds = new Set(
//       allOpdRegistration?.map((data) => data?.patientId?.toString())
//     );

//     // Filter Appointments based on OPD Registrations
//     const filteredAppointments = allAppointments.filter((appointment) =>
//       allOpdRegistrationIds.has(appointment._id.toString())
//     );

//     // New And Follow up patients
//     const { newPatients, followUpPatients } = (
//       filteredAppointments || []
//     ).reduce(
//       (acc, data) => {
//         if (data?.consultationType?.toLowerCase()?.trim() === "new") {
//           acc.newPatients++;
//         } else {
//           acc.followUpPatients++;
//         }

//         return acc;
//       },
//       {
//         newPatients: 0,
//         followUpPatients: 0,
//       }
//     );

//     // Cash and credit
//     const { cash, credit, totalRevenue } = (allOpdReceipts || [])?.reduce(
//       (acc, data) => {
//         if (data?.paymentMode?.toLowerCase()?.trim() === "cash") {
//           acc.cash++;
//         } else {
//           acc.credit++;
//         }

//         acc.totalRevenue += data.paidAmount || 0;
//         return acc;
//       },
//       { cash: 0, credit: 0, totalRevenue: 0 }
//     );

//     return res.json({
//       appointments: allAppointments,
//       opdRegistrations: allOpdRegistration,
//       newPatients,
//       followUpPatients,
//       cashRevenue: cash,
//       creditRevenue: credit,
//       totalRevenue,
//     });
//   } catch (error) {
//     console.error("Error fetching OPD Dashboard Data:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// const getOpdDashboardDataOfConsultant = async (req, res) => {
//   try {
//     const { consultantId } = req.params;

//     // Get current date range (00:00 to 23:59 UTC)
//     const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

//     // Fetch Appointments for the given consultant on the current date
//     const allAppointments = await PatientDetails.find({
//       consultantId,
//       date: currentDate,
//     });

//     const patientIds = allAppointments.map((data) => data._id.toString());
//     // Fetch OPD Registrations and Receipts for the filtered patients
//     const [allOpdRegistration, allOpdReceipts] = await Promise.all([
//       OpdPatientModel.find({ patientId: { $in: patientIds } }),
//       OpdReceiptsModel.find({ patientId: { $in: patientIds } }),
//     ]);
//     // Store OPD Registration IDs for filtering appointments
//     const allOpdRegistrationIds = new Set(
//       allOpdRegistration.map((data) => data.patientId.toString())
//     );

//     // Filter Appointments based on OPD Registrations
//     const filteredAppointments = allAppointments.filter((appointment) =>
//       allOpdRegistrationIds.has(appointment._id.toString())
//     );

//     // Count New and Follow-up Patients
//     const { newPatients, followUpPatients } = filteredAppointments.reduce(
//       (acc, data) => {
//         if (data.consultationType?.toLowerCase()?.trim() === "new") {
//           acc.newPatients++;
//         } else {
//           acc.followUpPatients++;
//         }
//         return acc;
//       },
//       { newPatients: 0, followUpPatients: 0 }
//     );

//     // Calculate Total Revenue
//     const totalRevenue = allOpdReceipts.reduce(
//       (acc, data) => acc + (data.paidAmount || 0),
//       0
//     );

//     // Count Checked and Waiting Patients
//     const { checked, waiting } = allOpdRegistration.reduce(
//       (acc, data) => {
//         if (data.status?.toLowerCase()?.trim() === "pending") {
//           acc.waiting++;
//         } else {
//           acc.checked++;
//         }
//         return acc;
//       },
//       { checked: 0, waiting: 0 }
//     );

//     return res.json({
//       totalAppointments: allAppointments.length,
//       filteredAppointments: filteredAppointments.length,
//       newPatients,
//       followUpPatients,
//       totalRevenue,
//       checkedPatients: checked,
//       waitingPatients: waiting,
//       appointments: allAppointments,
//     });
//   } catch (error) {
//     console.error("Error fetching OPD Dashboard Data for Consultant:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// const getOpdDashboardGraphData = async (req, res) => {
//   try {
//     const { type } = req.query; // 'date', 'month', or 'year'
//     if (!["date", "month", "year"].includes(type)) {
//       return res.status(400).json({ error: "Invalid type parameter" });
//     }

//     const formatMap = {
//       date: "%Y-%m-%d",
//       month: "%Y-%m",
//       year: "%Y",
//     };

//     const dateFormat = formatMap[type];

//     // Aggregate appointments grouped by date/month/year
//     const appointments = await PatientDetails.aggregate([
//       {
//         $addFields: {
//           formattedDate: {
//             $dateToString: {
//               format: dateFormat,
//               date: { $toDate: "$date" }, // 🔧 Convert to Date first
//             },
//           },
//         },
//       },
//       {
//         $group: {
//           _id: "$formattedDate",
//           totalAppointments: { $sum: 1 },
//           newPatients: {
//             $sum: {
//               $cond: [
//                 { $eq: [{ $toLower: "$consultationType" }, "new"] },
//                 1,
//                 0,
//               ],
//             },
//           },
//           followUpPatients: {
//             $sum: {
//               $cond: [
//                 { $eq: [{ $toLower: "$consultationType" }, "follow-up"] },
//                 1,
//                 0,
//               ],
//             },
//           },
//         },
//       },
//       {
//         $sort: { _id: 1 },
//       },
//     ]);

//     // Aggregate revenue grouped by date/month/year
//     const receipts = await OpdReceiptsModel.aggregate([
//       {
//         $addFields: {
//           formattedDate: {
//             $dateToString: {
//               format: dateFormat,
//               date: "$createdAt", // assumed to be a proper Date
//             },
//           },
//         },
//       },
//       {
//         $group: {
//           _id: "$formattedDate",
//           totalRevenue: { $sum: "$paidAmount" },
//         },
//       },
//       {
//         $sort: { _id: 1 },
//       },
//     ]);

//     // Merge appointment and revenue data
//     const resultMap = {};

//     appointments.forEach((item) => {
//       resultMap[item._id] = {
//         date: item._id,
//         totalAppointments: item.totalAppointments,
//         newPatients: item.newPatients,
//         followUpPatients: item.followUpPatients,
//         totalRevenue: 0,
//       };
//     });

//     receipts.forEach((item) => {
//       if (!resultMap[item._id]) {
//         resultMap[item._id] = {
//           date: item._id,
//           totalAppointments: 0,
//           newPatients: 0,
//           followUpPatients: 0,
//           totalRevenue: item.totalRevenue,
//         };
//       } else {
//         resultMap[item._id].totalRevenue = item.totalRevenue;
//       }
//     });

//     const resultArray = Object.values(resultMap).sort(
//       (a, b) => new Date(a.date) - new Date(b.date)
//     );

//     return res.json(resultArray);
//   } catch (error) {
//     console.error("Error fetching OPD dashboard graph data:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// const updatePatientStatus = async (req, res) => {
//   console.log("updatePatientStatus-----------");
//   try {
//     const { id } = req.params;
//     const { status, patientInTime } = req.body;

//     // Validation check
//     if (!id || !status) {
//       return res
//         .status(400)
//         .json({ error: "Patient ID and status are required" });
//     }

//     // Prepare update object
//     const updateFields = { status };

//     // If patientInTime is provided, add it to updateFields
//     if (patientInTime) {
//       updateFields.patientInTime = patientInTime;
//     }

//     // Update status and optionally patientInTime
//     const updated = await OpdPatientModel.findByIdAndUpdate(
//       id,
//       { $set: updateFields },
//       { new: true }
//     );
//     // console.log("updated", updated);

//     if (!updated) {
//       return res.status(404).json({ error: "Patient not found" });
//     }
//     emitPatientStatusUpdate(updated);

//     res.status(200).json({
//       message: "Patient status updated successfully",
//       data: updated,
//       success: true,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// const updateDoctorScheduleSlots = async (req, res) => {
//   try {
//     const { date, consultantId, time } = req.body;
//     console.log(req.body);
//     if (!consultantId || !date || !time) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing required fields" });
//     }

//     // Find the doctor's schedule
//     const ScheduleOfDoctor = await AppointmentSchedulingModel.findOne({
//       doctorId: consultantId,
//     });

//     if (!ScheduleOfDoctor) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Doctor schedule not found" });
//     }

//     // Find the specific day's schedule
//     const getPerticularDaySchedule = ScheduleOfDoctor.schedule.find(
//       (item) => item.date.toString() === date.toString() // Ensure date comparison works
//     );

//     if (!getPerticularDaySchedule) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Day schedule not found" });
//     }

//     // Function to update the time slot status
//     const updateTimeSlotStatus = (slot, time) => {
//       if (slot && slot.timeSlotsIntervalWise) {
//         const timeSlot = slot.timeSlotsIntervalWise.find(
//           (ts) => ts.time === time
//         );
//         if (timeSlot) {
//           timeSlot.booked = true;
//           timeSlot.status = "CHECKED";
//         }
//       }
//     };

//     // Update both slotA and slotB
//     updateTimeSlotStatus(getPerticularDaySchedule.slotA, time);
//     updateTimeSlotStatus(getPerticularDaySchedule.slotB, time);

//     // Mark the schedule as modified
//     ScheduleOfDoctor.markModified("schedule");

//     // Save the updated schedule back to the database
//     await ScheduleOfDoctor.save();

//     return res
//       .status(200)
//       .json({ success: true, message: "Doctor schedule updated successfully" });
//   } catch (error) {
//     console.error("Error updating doctor schedule:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// const getCheckedPatientDetail = async (req, res) => {
//   try {
//     const { departmentId, consultantId, date } = req.params;

//     // Fetch patients based on departmentId, consultantId & date range
//     const checkedPatients = await OpdPatientModel.find({
//       departmentId: departmentId,
//       consultantId: consultantId,
//       date, // Date range filtering
//     });

//     // If no patients found, return appropriate response
//     if (!checkedPatients.length) {
//       return res
//         .status(404)
//         .json({ success: false, message: "No checked patients found" });
//     }

//     // Return patient details
//     res.status(200).json({ success: true, data: checkedPatients });
//   } catch (error) {
//     console.error("Error fetching checked patients:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const changeBillType = async (req, res) => {
//   try {
//     const { type, patientId } = req.body;

//     // Validate if both 'type' and 'patientId' are provided
//     if (!type || !patientId) {
//       return res
//         .status(400)
//         .json({ error: "Bill type and patient ID are required." });
//     }

//     // Find the patient and update the bill type
//     const updatedPatient = await OpdPatientModel.findOneAndUpdate(
//       { patientId: patientId }, // Find patient by ID
//       { $set: { billType: type } }, // Update the billType field
//       { new: true } // Return the updated patient document
//     );
//     emitPatientStatusUpdate(updatedPatient);

//     // If no patient found
//     if (!updatedPatient) {
//       return res.status(404).json({ error: "Patient not found." });
//     }
//     return res.status(200).json({ success: true, updatedPatient });
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(500)
//       .json({ error: "Something went wrong while updating the bill type." });
//   }
// };

// module.exports = {
//   changeBillType,
//   CreateRegistrationDetail,
//   createRegistrationForSpecialCase,
//   getAllRegisteration,
//   updateRegistation,
//   getUhidAndRegNo,
//   getDailyConfirmedAppointmentConsultantWise,
//   getOpdPatientRegistrationById,
//   getOpdPatientRegistrationByIdWithToken,
//   getOpdDashboardData,
//   getOpdDashboardDataOfConsultant,
//   updatePatientStatus,
//   updateDoctorScheduleSlots,
//   getCheckedPatientDetail,
//   updateRegistrationForSpecialCase,
//   getOpdDashboardGraphData,
// };
