const IpdPatientModel = require("../../models/appointment-confirm/ipdPatient.model");
const UHID = require("../../models/UHID.model");
const PatientDetails = require("../../models/Masters/patientAppointment.model");
const AdminModel = require("../../models/admin.model");
const ConsultantModel = require("../../models/Staffs/consultants/consultants.model");
const EmployeeModel = require("../../models/Staffs/employee/employee.model");
const mongoose = require("mongoose");
const generateUHID = require("../../utils/generateUhid/generateuhid");

const getUhidAndRegNo = async (req, res) => {
  try {
    const lastUhid = await UHID.findOne().sort({ createdAt: -1 });
    const lastReg = await IpdPatientModel.findOne()
      .sort({ createdAt: -1 })
      .select("ipd_regNo");
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

    // const regNumber = await generateRegistrationNumber(formType);

    const { uhid } = uhidId;
    let whoBookId, whoBookName;
    let aadharCardFile = null;
    let abhaCardFile = null;

    if (req.files && req.files["aadhar_card"] && req.files["aadhar_card"][0]) {
      aadharCardFile = req.files["aadhar_card"][0].filename;
    }

    if (req.files && req.files["abha_card"] && req.files["abha_card"][0]) {
      abhaCardFile = req.files["abha_card"][0].filename;
    }

    if (
      req.files &&
      req.files["cardAttachment"] &&
      req.files["cardAttachment"][0]
    ) {
      cardAttachmentFile = req.files["cardAttachment"][0].filename;
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
    if (!req.body.patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }
    const defaultValues = {
      whoBookId,
      whoBookName,
      delete: false,
    };

    let tpaId;
    if (req.body.tpaId?.length === 0) {
      tpaId = null;
    } else {
      tpaId = req.body.tpaId;
    }
    const newRegDetail = new IpdPatientModel({
      ...defaultValues,
      aadhar_card: aadharCardFile,
      abha_card: abhaCardFile,
      ...req.body,
      tpaId: tpaId,
      uhid: req?.body?.uhidNo,
      cardAttachment: cardAttachmentFile,
    });

    await PatientDetails.findByIdAndUpdate(
      req.body.patientId,
      { $set: { isConfirm: true } },
      { new: true }
    );

    await newRegDetail.save();
    await generateUHID(req.body.uhidNo);
    return res.status(201).json({
      message: `${formType} registration  created successfully`,
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
    const RegData = await IpdPatientModel.find();
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

    const pRegistration = await IpdPatientModel.findById(id);
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

    const updatedRegistration = await IpdPatientModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      message: "Registration updated successfully",
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
