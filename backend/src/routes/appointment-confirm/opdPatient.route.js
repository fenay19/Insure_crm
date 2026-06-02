// const express = require("express");
// const multer = require("multer");
// const path = require("path");

// const {
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
//   changeBillType
// } = require("../../controllers/appointment-confirm/opdPatient.controller");

// const OPDPatientRouter = express.Router();

// OPDPatientRouter.put("/update-slot", updateDoctorScheduleSlots);
// OPDPatientRouter.put("/bill-type", changeBillType);
// OPDPatientRouter.get(
//   "/:departmentId/:consultantId/:date",
//   getCheckedPatientDetail
// );

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "src/public/images");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = `${Date.now()}-${Math.round(
//       Math.random() * 1e9
//     )}${path.extname(file.originalname)}`;
//     cb(null, `${file.fieldname}-${uniqueSuffix}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     "image/jpeg",
//     "image/png",
//     "image/jpg",
//     "application/pdf",
//   ];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error("Invalid file type. Only JPEG, PNG, JPG, and PDF are allowed.")
//     );
//   }
// };

// const upload = multer({
//   storage,
//   limits: { fileSize: 2 * 1024 * 1024 },
//   fileFilter,
// });

// OPDPatientRouter.post(
//   "/",
//   upload.fields([
//     { name: "aadhar_card", maxCount: 1 },
//     { name: "abha_card", maxCount: 1 },
//     { name: "cardAttachment", maxCount: 1 },
//     { name: "charityDocument", maxCount: 1 },
//   ]),
//   (req, res, next) => {
//     try {
//       CreateRegistrationDetail(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// OPDPatientRouter.post(
//   "/for-special-case",
//   upload.fields([
//     { name: "aadhar_card", maxCount: 1 },
//     { name: "abha_card", maxCount: 1 },
//     { name: "cardAttachment", maxCount: 1 },
//     { name: "charityDocument", maxCount: 1 },
//   ]),
//   (req, res, next) => {
//     try {
//       createRegistrationForSpecialCase(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   }
// );
// OPDPatientRouter.put(
//   "/update/for-special-case",
//   upload.fields([
//     { name: "aadhar_card", maxCount: 1 },
//     { name: "abha_card", maxCount: 1 },
//     { name: "cardAttachment", maxCount: 1 },
//     { name: "charityDocument", maxCount: 1 },
//   ]),
//   (req, res, next) => {
//     try {
//       updateRegistrationForSpecialCase(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// OPDPatientRouter.get("/", getAllRegisteration);
// OPDPatientRouter.get("/uhid-reg", getUhidAndRegNo);
// OPDPatientRouter.get("/patient/:id", getOpdPatientRegistrationById);
// OPDPatientRouter.get("/opd-dashboard-data/:date", getOpdDashboardData);
// OPDPatientRouter.get(
//   "/opd-dashboard-data-consultant/:consultantId",
//   getOpdDashboardDataOfConsultant
// );
// OPDPatientRouter.get("/opd-dashboard-data-graph",getOpdDashboardGraphData)

// OPDPatientRouter.get(
//   "/patientWithToken/:id",
//   getOpdPatientRegistrationByIdWithToken
// );

// OPDPatientRouter.put(
//   "/:id",
//   upload.fields([
//     { name: "aadhar_card", maxCount: 1 },
//     { name: "abha_card", maxCount: 1 },
//     { name: "cardAttachment", maxCount: 1 },
//     { name: "charityDocument", maxCount: 1 },
//   ]),
//   (req, res, next) => {
//     try {
//       updateRegistation(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// OPDPatientRouter.get(
//   "/getDailyConfirmedAppoitmentsConsultantWise/:id",
//   getDailyConfirmedAppointmentConsultantWise
// );
// OPDPatientRouter.put("/update-patient-status/:id", updatePatientStatus);

// OPDPatientRouter.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     return res.status(400).json({ error: err.message });
//   } else if (err) {
//     return res.status(500).json({ error: err.message });
//   }
//   next();
// });

// module.exports = OPDPatientRouter;
