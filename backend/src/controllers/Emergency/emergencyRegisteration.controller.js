const PatientDetails = require("../../models/Patient/patientdetails.model");
const EmergencyRegisterModel = require("../../models/Emergency/emergencyRegistration.model");
const AdminModel = require("../../models/admin.model");
const ConsultantModel = require("../../models/Staffs/consultants/consultants.model");
const EmployeeModel = require("../../models/Staffs/employee/employee.model");
const mongoose = require("mongoose")

const generateEmUHID = async () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const date = String(currentDate.getDate()).padStart(2, "0");

  const lastEntry = await EmergencyRegisterModel.findOne({})
    .sort({ createdAt: -1 })
    .select("uhid");

  let newSerialNumber;

  if (lastEntry && lastEntry.uhid) {
      const parts = lastEntry.uhid.split("-");

      if (parts.length === 2) { 
          const lastSerial = parts[1]; 

          newSerialNumber = (parseInt(lastSerial, 10) + 1).toString().padStart(7, "0");
      } else {
          newSerialNumber = "0000001";
      }
  } else {
    newSerialNumber = "0000001";
  }

  const newUHID = `${year}${month}${date}-${newSerialNumber}`;
  
  return newUHID; 
};


const generateEmrNumber = async () => {
  const year = new Date().getFullYear();

  const x = await EmergencyRegisterModel.findOne({})
    .sort({ createdAt: -1 })
    .select("emergencyNo");

  let newSerialNumber;

  if (x && x.emergencyNo) {
    const lastSerial = x.emergencyNo.split("-")[2];
    newSerialNumber = (parseInt(lastSerial) + 1).toString().padStart(5, "0");
  } else {
    newSerialNumber = "00001";
  }

  return `EM-${year}-${newSerialNumber}`;
};


const CreateEmergencyDetail = async (req, res) => {
  try {
    const userId = req.user?.adminId;
    const user = await AdminModel.findOne({ _id: userId });
    let EmrNumber = await generateEmrNumber();
    let EmUHID = await generateEmUHID();
    let PdUHID = await generateEmUHID();
    let whoBookId, whoBookName;

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
      uhid: EmUHID,
      emergencyNo: EmrNumber,
      whoBookId: whoBookId,
      whoBookName: whoBookName,
      delete: false,
      dateArrivals: "",
      massCasuality: false,
      patientId: null,
      prefix: "",
      prefixId: "",
      mobileNo: null,
      patientname: "unknown",
      dob: "",
      age: null,
      weight: null,
      gender: "",
      occupation: "",
      patientResidence: "",
      arrivalMode: "",
      noOfPriorFacilities: "",
      referBy: "",
      refferName: "",
      refferMobile: null,
      ambulatory: "",
      contactPersonPrefix: "",
      contactPerson: "",
      contactPersonNo: null,
      contactPersonRelation: "",
      consultants: [],
      status: "pending",
      billingStatus: "Non_Paid",
      patientIn: false,
      totalAmount: 0,
      discountAmount: 0,
      paidAmount: 0,
      finalAmount: 0,
    };

    let newEmrDetail = new EmergencyRegisterModel({
      ...defaultValues,
      ...req.body,
    });

    const newPatientDetail = new PatientDetails({
      uhid: PdUHID,
      prefix: "",
      prefixId: null,
      patientname: "unknown",
      dob: "",
      age: "",
      birth_time: "",
      mobile_no: "",
      gender: "",
      maritalStatus: "",
      nationality: "",
      country: "",
      state: "",
      district: "",
      area: "",
      address: "",
      pincode: "",
      aadhar_no: "",
      aadhar_card: "",
      abha_no: "",
      abha_card: "",
      relativePrifix: "",
      relative_name: "",
      relative_mobile: "",
      relation: "",
      patientPhoto: "",
      patientImpression: "",
    });

    try {
      // Save new patient details
    const patientData = await newPatientDetail.save();

    newEmrDetail.patientId = patientData._id; 
    await newEmrDetail.save();

    } catch (saveError) {
      console.error("Error saving patient details:", saveError);
      return res.status(500).json({ message: "Error saving patient details", error: saveError.message });
    }

    return res.status(201).json({
      message: "Emergency registration and patient details created successfully",
      emergencyRegistration: newEmrDetail,
      patientDetails: newPatientDetail,
    });
  } catch (error) {
    console.error('Error during CreateEmergencyDetail:', error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



const getAllEmergencyRegisteration = async (req, res) => {
  try {
    const EmrData = await EmergencyRegisterModel.find();
    return res.status(200).json({ data: EmrData });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const updateEmergencyRegistation = async (req, res) => {
  try {
    
    const { id } = req.params;
    const { patientId, ...updateData } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid emergency registration ID" });
    }

    if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: "Invalid or missing patient ID" });
    }

    const emergencyRegistration = await EmergencyRegisterModel.findById(id);
    if (!emergencyRegistration) {
      return res.status(404).json({ message: "Emergency registration not found" });
    }

    const patientDetails = await PatientDetails.findById(patientId);
    if (!patientDetails) {
      return res.status(404).json({ message: "Patient details not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(updateData.prefixId)) {
      return res.status(400).json({ message: "Invalid or missing prefix" });
    }

    Object.keys(req.body).forEach((key) => {
      if (patientDetails[key] !== undefined && req.body[key] !== undefined) {
        patientDetails[key] = req.body[key];
      }
    });

    await patientDetails.save();

    const updatedEmergencyRegistration = await EmergencyRegisterModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Emergency registration and patient details updated successfully",
      emergencyRegistration: updatedEmergencyRegistration,
      patientDetails,
    });
  } catch (error) {
    console.error("Error updating emergency registration:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};



const emergencyLive = async (req, res) => {
  try {
    const emergencies = await EmergencyRegisterModel
      .find({
        delete: false,
        patientIn: false,
        status: "pending"
      })
      .populate('patientId');

    const modifiedEmergencies = emergencies.map(emergency => {
      const { patientId, ...rest } = emergency.toObject();
      return {
        ...rest,
        patientDetails: patientId
      };
    });



    return res.status(200).json({
      msg: "Live Emergency Data Retrived Successfully",
      data: modifiedEmergencies
    });

    
  } catch (error) {
    return res
      .status(500)
      .json({
        error: 'Internal Server Error',
        msg: error.messgage
      });
  }
};


module.exports = {
  CreateEmergencyDetail,
  getAllEmergencyRegisteration,
  updateEmergencyRegistation,
  emergencyLive
};
