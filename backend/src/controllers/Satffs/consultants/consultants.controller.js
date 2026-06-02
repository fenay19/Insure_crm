const { ConsultantModel, EmployeeModel,Consultant } = require("../../../models");
const { AdminModel } = require("../../../models");
const { RoleModel } = require("../../../models");
const { OPDMenuModel } = require("../../../models");
const consultantValidation = require("../../../validations/Staffs/consultants/consultants.validations");
const httpStatus = require("http-status");
// const axios = require('axios');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mongoose = require("mongoose");
const { emitRightsUpdated } = require("../../../utils/socket");
const createDoctorInSteps = async (req, res) => {
  try {
    const menu = [
      "Vitals",
      "Chief Complaint",
      "History of Present Illness",
      "Medical History",
      "Examination",
      "Medical Prescription",
      "Provisional Diagnosis",
      "Final Diagnosis",
      "Orders",
      "Follow Up",
    ];

    const printMenu = [
      "Vitals",
      "Chief Complaint",
      "Medical Prescription",
      "Orders",
      "With Header",
    ];

    //creating two new arrays for emergency vitals

    const emergencyMenu = [
      "Vitals",
      "Chief Complaint",
      "Treating Provider Assessment",
      "High Risk Signs",
      "Primary Survey",
      "History of Present Illness",
      "Medical History",
      "Examination",
      "Medical Prescription",
      "Provisional Diagnosis",
      "Final Diagnosis",
      "Assessment & Plan",
      "Orders",
      "Follow Up",
      "Transfer/ Referred",
    ];

    const emergencyPrintMenu = [
      "Vitals",
      "Chief Complaint",
      "Medical Prescription",
      "Orders",
      "With Header",
    ];

    const userId = req.user.branchId;
    // console.log(userId);
    const { step, data } = req.body;
    if (step === "basicDetails") {
      const { error, value } = consultantValidation.validate(data, {
        abortEarly: false,
      });
      if (error) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ errors: error.details });
      }

      value.basicDetails.user = userId;

      const existingEmail = await ConsultantModel.findOne({
        "basicDetails.email": data.basicDetails.email,
        delete: false,
      });
      const existingMobile = await ConsultantModel.findOne({
        "basicDetails.mobile": data.basicDetails.mobile,
        delete: false,
      });
      const existingAadhar = await ConsultantModel.findOne({
        "basicDetails.aadhar": data.basicDetails.aadhar,
        delete: false,
      });

      if (existingEmail) {
        return res
          .status(httpStatus.CONFLICT)
          .json({ msg: "Email already exists!" });
      }

      if (existingMobile) {
        return res
          .status(httpStatus.CONFLICT)
          .json({ msg: "Mobile number already exists!" });
      }

      if (existingAadhar) {
        return res
          .status(httpStatus.CONFLICT)
          .json({ msg: "Aadhar number already exists!" });
      }

      const adminWithEmail = await AdminModel.findOne({
        email: data.basicDetails.email,
      });
      if (adminWithEmail) {
        return res
          .status(httpStatus.CONFLICT)
          .json({ msg: "Email already exists in admin records!" });
      }

      const name =
        data.basicDetails.prefix +
        "." +
        " " +
        data.basicDetails.firstName +
        " " +
        data.basicDetails.lastName;
      const email = data.basicDetails.email;
      const username = name.substring(0, 2);
      const middleChars = data.basicDetails.mobile.substring(4);
      const specialChar = "@";
      const generatedPassword = `${username}${specialChar}${middleChars}`;
      // console.log(generatedPassword);
      const hashedPassword = await bcrypt.hash(generatedPassword, saltRounds);

      const role = "doctor";
      const Roles = await RoleModel.findOne({ name: role });

      const newDoctor = new ConsultantModel(value);
      const savedDoctor = await newDoctor.save();
      const newUser = new AdminModel({
        name,
        email,
        password: hashedPassword,
        refId: savedDoctor._id,
        role: role,
        roleId: Roles._id,
      });

      await newUser.save();

      const opdMenu = new OPDMenuModel({
        menu: menu,
        printMenu: printMenu,
        emergencyMenu: emergencyMenu,
        emergencyPrintMenu: emergencyPrintMenu,
        consultantId: savedDoctor._id,
      });

      await opdMenu.save();
      return res.status(httpStatus.CREATED).json({
        msg: "Doctor record created successfully!!",
        doctorId: savedDoctor._id,
      });
    } else if (step === "documents") {
      const { doctorId, sign } = req.body;
      console.log("doctorId", doctorId);
      const documentFields = [
        "aadharCard",
        "panCard",
        "passbook",
        "photo",
        "joining",
        "revealing",
        "SSC",
        "HSC",
        "graduation",
        "postGraduation",
        "other",
      ];

      const existingDoctor = await ConsultantModel.findById({ _id: doctorId });
      if (!existingDoctor) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ msg: "1Doctor not found!!" });
      }

      const uploadedFiles = {};

      for (const key of documentFields) {
        const files = req.files[key];
        if (files && files.length > 0) {
          uploadedFiles[key] = files.map((file) => file.filename).join(", ");
        }
      }

      try {
        existingDoctor.documents = { ...uploadedFiles, sign: sign };
        await existingDoctor.save();
        return res
          .status(httpStatus.CREATED)
          .json({ msg: "Documents uploaded and links saved successfully!!" });
      } catch (error) {
        console.error(error);
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ msg: "Internal Server Error!!" });
      }
    } else {
      const { doctorId } = req.body;
      const existingDoctor = await ConsultantModel.findById({ _id: doctorId });
      if (!existingDoctor) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ msg: "Doctor not found!!" });
      }

      switch (step) {
        case "addressDetails":
          existingDoctor.addressDetails = data.addressDetails;
          break;
        case "educationalDetails":
          existingDoctor.educationalDetails = data.educationalDetails;
          break;
        case "bankingDetails":
          const existingPAN = await ConsultantModel.findOne({
            "bankingDetails.panNumber": data.bankingDetails.panNumber,
            delete: false,
          });
          if (existingPAN) {
            return res
              .status(httpStatus.BAD_REQUEST)
              .json({ msg: "PAN number already exists in bank details!" });
          }
          existingDoctor.bankingDetails = data.bankingDetails;
          break;
        default:
          return res
            .status(httpStatus.BAD_REQUEST)
            .json({ msg: "Invalid step!!" });
      }

      await existingDoctor.save();
      return res
        .status(httpStatus.OK)
        .json({ msg: `${step} updated successfully!!`, doctorId });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error!!" });
  }
};

// const getAllConsultants = async (req, res) => {
//   try {
//     const user = await AdminModel.findOne({ _id: req.user.adminId });
//     if (user.role == "admin") {
//       const consultants = await ConsultantModel.find({
//         delete: false,
//         "basicDetails.user": req.user.branchId,
//       });
//       res.status(httpStatus.OK).json({ data: consultants });
//     } else if (user.role == "doctor") {
//       const existingConsultant = await ConsultantModel.findOne({
//         _id: req.user.branchId,
//       });
//       const consultants = await ConsultantModel.find({
//         delete: false,
//         "basicDetails.user": existingConsultant.basicDetails.user,
//       });
//       res.status(httpStatus.OK).json({ data: consultants });
//     } else if (user.role !== "admin" && user.role !== "doctor") {
//       const existingEmployee = await EmployeeModel.findOne({
//         _id: req.user.branchId,
//       });
//       const consultants = await ConsultantModel.find({
//         delete: false,
//         "basicDetails.user": existingEmployee.basicDetails.user,
//       });
//       res.status(httpStatus.OK).json({ data: consultants });
//     }
//   } catch (error) {
//     console.error(error);
//     res
//       .status(httpStatus.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Internal server error!!" });
//   }
// };

const getAllConsultants = async (req, res) => {
  try {
    const consultants = await ConsultantModel.find({ delete: false });
    res.status(200).json({ data: consultants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error!" });
  }
};

const updateConsultantById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const { step } = req.body;
    const deletes = false;

    let updatedConsultant;
    switch (step) {
      case "basicDetails":
        const existingCons = await ConsultantModel.findOne({
          "basicDetails.email": data.basicDetails.email,
          delete: deletes,
        });
        const existingMobile = await ConsultantModel.findOne({
          "basicDetails.mobile": data.basicDetails.mobile,
          delete: deletes,
        });
        const existingAadhar = await ConsultantModel.findOne({
          "basicDetails.aadhar": data.basicDetails.aadhar,
          delete: deletes,
        });
        const adminWithEmail = await AdminModel.findOne({ refId: id });
        if (existingCons && existingCons._id.toString() !== id) {
          return res
            .status(httpStatus.BAD_REQUEST)
            .json({ msg: "Email already exists!!" });
        }
        if (existingMobile && existingMobile._id.toString() !== id) {
          return res
            .status(httpStatus.CONFLICT)
            .json({ msg: "Mobile number already exists!" });
        }

        if (existingAadhar && existingAadhar._id.toString() !== id) {
          return res
            .status(httpStatus.CONFLICT)
            .json({ msg: "Aadhar number already exists!" });
        }
        if (adminWithEmail && adminWithEmail.refId.toString() !== id) {
          return res
            .status(httpStatus.CONFLICT)
            .json({ msg: "Email already exists in admin records!" });
        }
        const name =
          data.basicDetails.prefix +
          "." +
          " " +
          data.basicDetails.firstName +
          " " +
          data.basicDetails.lastName;
        updatedConsultant = await AdminModel.findByIdAndUpdate(
          { _id: adminWithEmail._id },
          { $set: { email: data.basicDetails.email, name: name } },
          { new: true }
        );
        updatedConsultant = await ConsultantModel.findByIdAndUpdate(
          { _id: id },
          { $set: data },
          { new: true }
        );
        break;
      case "addressDetails":
        updatedConsultant = await ConsultantModel.findByIdAndUpdate(
          { _id: id },
          { $set: data },
          { new: true }
        );
        break;
      case "educationalDetails":
        updatedConsultant = await ConsultantModel.findByIdAndUpdate(
          { _id: id },
          { $set: data },
          { new: true }
        );
        break;
      case "bankingDetails":
        const existingPAN = await ConsultantModel.findOne({
          "bankingDetails.panNumber": data.bankingDetails.panNumber,
          delete: deletes,
        });
        if (existingPAN && existingPAN._id.toString() !== id) {
          return res
            .status(httpStatus.BAD_REQUEST)
            .json({ msg: "PAN number already exists in bank details!" });
        }
        updatedConsultant = await ConsultantModel.findByIdAndUpdate(
          { _id: id },
          { $set: data },
          { new: true }
        );
        break;
      default:
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ msg: "Invalid step!!" });
    }

    if (!updatedConsultant) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "Consultant not found!!" });
    }

    res.status(httpStatus.OK).json({
      msg: "Consultant details updated successfully!!",
      data: updatedConsultant,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error!!" });
  }
};

const getConsultantById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.adminId;
    const consultant = await ConsultantModel.findById({
      _id: id,
      "basicDetails.user": userId,
    });
    if (!consultant) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "Consultant not found!!" });
    }

    res.status(httpStatus.OK).json({ data: consultant });
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error!!" });
  }
};
const getConsultantByDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.adminId;

    console.log("Searching for department ID:", new mongoose.Types.ObjectId(id));

    const consultant = await Consultant.find({
      "employmentDetails.departmentOrSpeciality": new mongoose.Types.ObjectId(id),
    //  "basicDetails.user": new mongoose.Types.ObjectId(userId), // assuming it's an ObjectId
    }).populate("employmentDetails.departmentOrSpeciality","departmentName");

    if (!consultant) {
      return res
        .status(404)
        .json({ msg: "Consultant not found!!" });
    }

    return res.status(200).json({ data: consultant });
  } catch (error) {
    console.error("Error fetching consultant by department:"  , error);
    return res
      .status(500)
      .json({ msg: "Internal server error!!" });
  }
};



const markConsultantAsDeleted = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("markConsultantAsDeleted called", id);
    const consultant = await ConsultantModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now() }
    );
    if (!consultant) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "Consultant not found!!" });
    }
    const email = consultant.basicDetails.email;
    const admin = await AdminModel.findOneAndDelete({ email });

    res.status(httpStatus.OK).json({ msg: "Consultant marked as deleted!!" });
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error!!" });
  }
};

const updateUploadedDocuments = async (req, res) => {
  try {
    const { doctorId, sign } = req.body;
    const documentFields = [
      "aadharCard",
      "panCard",
      "passbook",
      "photo",
      "joining",
      "revealing",
      "SSC",
      "HSC",
      "graduation",
      "postGraduation",
      "other",
    ];

    const existingDoctor = await ConsultantModel.findById(doctorId);
    if (!existingDoctor) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "Doctor not found!!" });
    }

    const uploadedFiles = {};

    for (const key of documentFields) {
      const files = req.files[key];
      if (files && files.length > 0) {
        uploadedFiles[key] = files.map((file) => file.filename).join(", ");
      } else {
        uploadedFiles[key] = existingDoctor.documents[key] || "";
      }
    }

    existingDoctor.documents = {
      ...existingDoctor.documents,
      ...uploadedFiles,
      sign: sign,
    };
    await existingDoctor.save();

    return res
      .status(httpStatus.CREATED)
      .json({ msg: "Documents updated successfully!!" });
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error!!" });
  }
};

const bulkImport = async (req, res) => {
  try {
    const newDoctors = req.body;
    const basicDetailsArray = newDoctors.map((doctor) => ({
      basicDetails: {
        prefix: doctor.prefix,
        prefixId: doctor.prefixId,
        firstName: doctor.firstName,
        middleName: doctor.middleName,
        lastName: doctor.lastName,
        gender: doctor.gender,
        fatherName: doctor.fatherName,
        mobile: doctor.mobile,
        alternateMobile: doctor.alternateMobile,
        email: doctor.email,
        alternateEmail: doctor.alternateEmail,
        aadhar: doctor.aadhar,
        department: doctor.department,
        departmentId: doctor.departmentId,
        designation: doctor.designation,
        designationId: doctor.designationId,
        dateOfJoining: doctor.dateOfJoining,
      },
    }));
    const result = await ConsultantModel.insertMany(basicDetailsArray);
    res
      .status(httpStatus.CREATED)
      .json({ msg: "Doctor record created successfully!!", data: result });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};


const createSystemRights = async (req, res) => {
  console.log("createSystemRights called", req.body);
  const { id } = req.params; // Extract the ID from the request parameters
  const { authorizedIds, actionPermissions } = req.body; // Extract the data from the request body

  try {
    // Validate the input
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    if (!authorizedIds || !actionPermissions) {
      return res.status(400).json({
        success: false,
        message: "Both authorizedIds and actionPermissions are required",
      });
    }

    // Find the record by ID
    const existingRecord = await Consultant.findById(id);

    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: "Nursing and Paramedical record not found",
      });
    }

    // Update the systemRights field
    existingRecord.systemRights = {
      authorizedIds: new Map(Object.entries(authorizedIds)), // Convert object to Map
      actionPermissions: new Map(
        Object.entries(actionPermissions).map(([key, value]) => [
          key,
          {
            Add: value.Add || false,
            View: value.View || false,
            Edit: value.Edit || false,
            Delete: value.Delete || false,
          },
        ])
      ), // Convert nested object to Map
    };

    // Save the updated record
    existingRecord.access = true; // Set access to true
    // Save the updated record
    await existingRecord.save();
    emitRightsUpdated(existingRecord._id); // Emit the event to notify the user about rights update
  

    return res.status(200).json({
      success: true,
      message: "System rights updated successfully",
      data: existingRecord.systemRights,
    });
  } catch (error) {
    console.error("Error updating system rights:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update system rights",
      error: error.message,
    });
  }
};

module.exports = {
  createDoctorInSteps,
  getAllConsultants,
  updateConsultantById,
  getConsultantById,
  markConsultantAsDeleted,
  updateUploadedDocuments,
  bulkImport,
  getConsultantByDepartment,
  createSystemRights
};
