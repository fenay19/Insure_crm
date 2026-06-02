const EmrPatientModel = require("../../models/appointment-confirm/emrPatient.model");
const UHID = require("../../models/UHID.model");
const PatientDetails = require("../../models/Masters/patientAppointment.model");
const AdminModel = require("../../models/admin.model");
const ConsultantModel = require("../../models/Staffs/consultants/consultants.model");
const EmployeeModel = require("../../models/Staffs/employee/employee.model");
const mongoose = require("mongoose");
const generateUHID = require("../../utils/generateUhid/generateuhid");

// let uhidId;
// const generateUHID = async () => {
//     try {
//       const lastEntry = await UHID.findOne().sort({ createdAt: -1 });
//       const currentDate = new Date();
//       const year = currentDate.getFullYear();
//       const month = String(currentDate.getMonth() + 1).padStart(2, '0');
//       const date = String(currentDate.getDate()).padStart(2, '0');

//       let newSerialNumber;

//       if (lastEntry && lastEntry.uhid) {
//         const parts = lastEntry.uhid.split('-');

//         if (parts.length === 2) {
//           const lastSerial = parts[1];

//           newSerialNumber = (parseInt(lastSerial, 10) + 1).toString().padStart(7, '0');
//         } else {
//           newSerialNumber = '0000001';
//         }
//       } else {
//         newSerialNumber = '0000001';
//       }

//       const newUHID = `${year}${month}${date}-${newSerialNumber}`;
//       const newUHIDDocument = new UHID({ uhid: newUHID });
//       uhidId = await newUHIDDocument.save();

//       return newUHID;

//     } catch (error) {
//       console.error('Error in generateUHID:', error);
//       throw error;
//     }
//   };

//   const generateRegistrationNumber = async () => {
//   const year = new Date().getFullYear();
//   const lastEntry = await EmrPatientModel
//     .findOne({})
//     .sort({ createdAt: -1 })
//     .select('emr_regNo');
//   let newSerialNumber;

//   if (lastEntry && lastEntry['emr_regNo']) {
//     const lastSerial = lastEntry['emr_regNo'].split("-")[2];
//     newSerialNumber = (parseInt(lastSerial, 10) + 1).toString().padStart(5, "0");
//   } else {
//     newSerialNumber = "00001";
//   }

//   return `EMR-${year}-${newSerialNumber}`;
// };

const getUhidAndRegNo = async (req, res) => {
  try {
    const lastUhid = await UHID.findOne().sort({ createdAt: -1 });
    const lastReg = await EmrPatientModel.findOne()
      .sort({ createdAt: -1 })
      .select("emr_regNo");
    res.json({
      data: {
        uhid: lastUhid,
        reg: lastReg,
      },
    });
  } catch (err) {}
};
const CreateRegistrationDetail = async (req, res) => {
  try {
    const userId = req.user?.adminId;
    const user = await AdminModel.findOne({ _id: userId });
    const formType = req.body.formType;
    if (!formType)
      return res.status(400).json({ message: "Form type is required" });

    const { uhid } = await generateUHID(req.body.uhidNo);
    let whoBookId, whoBookName;
    let aadharCardFile = null;
    let abhaCardFile = null;

    if (req.files && req.files["aadhar_card"] && req.files["aadhar_card"][0]) {
      aadharCardFile = req.files["aadhar_card"][0].filename;
    }

    if (req.files && req.files["abha_card"] && req.files["abha_card"][0]) {
      abhaCardFile = req.files["abha_card"][0].filename;
    }

    if (user?.role === "admin") {
      req.body.user = user?.refId;
      whoBookId = user?.refId;
      whoBookName = user?.name;
    } else if (user?.role === "doctor") {
      const doctor = await ConsultantModel.findOne({ _id: user?.refId });
      req.body.user = doctor?.basicDetails.user;
      whoBookId = user?.refId;
      whoBookName = user?.name;
    } else {
      const employee = await EmployeeModel.findOne({ _id: user?.refId });
      req.body.user = employee?.basicDetails.user;
      whoBookId = user?.refId;
      whoBookName = user?.name;
    }

    const defaultValues = {
      uhid,
      whoBookId,
      whoBookName,
      delete: false,
      patientname: "Unknown",
    };

    let tpaId;
    if (req.body.tpaId?.length === 0) {
      tpaId = null;
    } else {
      tpaId = req.body.tpaId;
    }

    const newRegDetail = new EmrPatientModel({
      ...defaultValues,
      aadhar_card: aadharCardFile,
      abha_card: abhaCardFile,
      ...req.body,
      tpaId: tpaId,
    });

    await newRegDetail.save();

    return res.status(201).json({
      message: `${formType} registration created successfully`,
      patientRegistration: newRegDetail,
    });
  } catch (error) {
    console.error("Error during CreateRegistrationDetail:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getAllRegisteration = async (req, res) => {
  try {
    const RegData = await EmrPatientModel.find();
    return res.status(200).json({ data: RegData });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const updateRegistation = async (req, res) => {
  try {
    const { id } = req.params;
    const { patientId, ...updateData } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid registration ID" });
    }

    if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: "Invalid or missing patient ID" });
    }

    const pRegistration = await EmrPatientModel.findById(id);
    if (!pRegistration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const patientDetails = await PatientDetails.findById(patientId);
    if (!patientDetails) {
      return res.status(404).json({ message: "Patient details not found" });
    }

    Object.keys(updateData).forEach((key) => {
      if (patientDetails[key] !== undefined && updateData[key] !== undefined) {
        patientDetails[key] = updateData[key];
      }
    });

    await patientDetails.save();

    const updatedRegistration = await EmrPatientModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      message: "Registration and patient details updated successfully",
      patientRegistration: updatedRegistration,
      patientDetails,
    });
  } catch (error) {
    console.error("Error updating registration:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = {
  CreateRegistrationDetail,
  getAllRegisteration,
  updateRegistation,
  getUhidAndRegNo,
};
