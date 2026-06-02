const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { ConsultantModel } = require("../models");
const { EmployeeModel } = require("../models");
const { AdminModel } = require("../models");
const { CompanySetupModel } = require("../models");
require("dotenv").config();
const httpStatus = require("http-status");
const { DepartmentSetupModel } = require("../models");
const mongoose = require("mongoose"); // ✅ make sure it's imported
const nodemailer = require("nodemailer");

const {
  Administrative,
  NursingAndParamedical,
  MedicalOfficer,
  Support,
  Consultant,
} = require("../models");

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const domainRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && domainRegex.test(email);
}

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid email format!!" });
    }

    const existingAdmin = await AdminModel.findOne({ email: email });
    if (existingAdmin) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "User already exists!!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new AdminModel({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });
    await newAdmin.save();
    res
      .status(httpStatus.CREATED)
      .json({ msg: "Admin registered successfully!!", admin: newAdmin });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
    console.log(error);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the admin exists
    const admin = await AdminModel.findOne({ email: email });
    if (!admin) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid email or password" });
    }
    // Check if the account is blocked
    // console.log("admin is", admin);
    if (admin.isBlocked) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json({ msg: "Your account is blocked" });
    }
    // Validate password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      {
        adminId: admin._id,
        branchId: admin.refId,
        pass: admin.password,
        role: "admin",
      },
      // "Bearar"
      process.env.JWT_SECRET_KEY
    );
    const populatedUser = await AdminModel.findOne({ email: email }).populate({
      path: "refId",
      model: admin.refType,
      populate: [
        {
          path: "employmentDetails.departmentOrSpeciality",
          model: "DepartmentSetup",
          options: { strictPopulate: false },
        },
      ],
    });

    const { departmentName, _id: departmentId } =
      populatedUser?.refId?.employmentDetails?.departmentOrSpeciality || {};

    const responseData = {
      msg: `Welcome ${admin.name}`,
      token: token,
      adminId: admin._id,
      Email: admin.email,
      Name: admin.name,
      role: admin.role,
      login: admin,
      departmentName: departmentName ? departmentName : "",
      departmentId: departmentId ? departmentId : "",
      empCode: populatedUser?.refId?.basicDetails?.empCode || "",
      systemRight: populatedUser?.refId?.systemRights || {},
      endDate: populatedUser?.refId?.endDate,
    };
    // console.log("responseData", responseData);

    res.status(httpStatus.OK).json(responseData);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
    console.log(error);
  }
};

// const loginAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body
//     const admin = await AdminModel.findOne({ email: email })

//     if (!admin) {
//       return res
//         .status(httpStatus.BAD_REQUEST)
//         .json({ msg: 'Invalid email or password' })
//     }

//     const blockedAdmin = await AdminModel.findOne({ email: email })
//     if (blockedAdmin.isBlocked === true) {
//       return res
//         .status(httpStatus.FORBIDDEN)
//         .json({ error: 'Your account is blocked' })
//     }

//     const isPasswordValid = await bcrypt.compare(password, admin.password)
//     if (!isPasswordValid) {
//       return res
//         .status(httpStatus.BAD_REQUEST)
//         .json({ msg: 'Invalid email or password' })
//     }

//     const token = jwt.sign(
//       { adminId: admin._id, branchId: admin.refId },
//       'Bearar'
//     )
//     await admin.save()
//     if (admin) {
//       const role = admin.role
//       if (role === 'doctor') {
//         const existingDoctor = await ConsultantModel.find({ _id: admin.refId })
//         // const Admin = await AdminModel.findOne({ _id: existingDoctor[0].basicDetails.user.toString()  });
//         const existingCompany = await CompanySetupModel.find({
//           _id: existingDoctor[0].basicDetails.user.toString()
//         })
//         res.status(httpStatus.OK).json({
//           msg: `Welcome ${admin.name}`,
//           token: token,
//           adminId: admin._id,
//           Email: admin.email,
//           Name: admin.name,
//           role: admin.role,
//           roleId: admin.roleId,
//           login: existingDoctor[0],
//           logo: existingCompany[0].hospitalLogo.data,
//           hospitalData: existingCompany[0],
//           hospitalName: existingCompany[0].hospitalName,
//           mobileNumber: existingCompany[0].mobileNumber,
//           landLineNumber: existingCompany[0].landlineNumber,
//           branchId: existingDoctor[0].basicDetails.user
//         })
//       } else if (role !== 'doctor' && role !== 'admin') {
//         const existingEmployee = await EmployeeModel.find({ _id: admin.refId })
//         const Admin = await AdminModel.findOne({
//           refId: existingEmployee[0].basicDetails.user.toString()
//         })
//         const existingCompany = await CompanySetupModel.find({
//           _id: Admin.refId.toString()
//         })
//         res.status(httpStatus.OK).json({
//           msg: `Welcome ${admin.name}`,
//           token: token,
//           adminId: admin._id,
//           Email: admin.email,
//           Name: admin.name,
//           role: admin.role,
//           roleId: admin.roleId,
//           login: existingEmployee[0],
//           logo: existingCompany[0].hospitalLogo.data
//         })
//       } else if (role === 'admin') {
//         const existingCompany = await CompanySetupModel.find({
//           _id: admin.refId
//         })
//         res.status(httpStatus.OK).json({
//           msg: `Welcome ${admin.name}`,
//           token: token,
//           adminId: admin._id,
//           Email: admin.email,
//           Name: admin.name,
//           role: admin.role,
//           roleId: admin.roleId,
//           login: existingCompany[0],
//           branchId: admin.refId
//         })
//       } else {
//         res.status(httpStatus.OK).json({
//           msg: `Welcome ${admin.name}`,
//           token: token,
//           adminId: admin._id,
//           Email: admin.email,
//           Name: admin.name,
//           role: admin.role,
//           roleId: admin.roleId
//         })
//       }
//     }
//   } catch (error) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: 'Server error' })
//     console.log(error)
//   }
// }

const getAllAdmin = async (req, res) => {
  try {
    const user = await AdminModel.find({ isBlocked: false });
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ msg: "No user found" });
    }
    res.status(httpStatus.OK).json({ user });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
};

const getAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await AdminModel.findById({ _id: id });
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ msg: "User not found" });
    }
    res.status(httpStatus.OK).json({ user: user });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await AdminModel.findByIdAndDelete({ _id: id });
    res.status(httpStatus.OK).json({ msg: "Admin deleted successfully" });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
};

const blockAdmin = async (req, res) => {
  // console.log("hii");
};

const unblockAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await AdminModel.findOneAndUpdate(
      { email },
      { isBlocked: false, updatedAt: Date.now() }
    );
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Admin not found" });
    }
    res
      .status(httpStatus.OK)
      .json({ message: "Admin unblocked successfully", admin: user });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong" });
  }
};

const getBlockedAdmin = async (req, res) => {
  try {
    const blockedUsers = await AdminModel.find({ isBlocked: true });
    if (!blockedUsers) {
      return res.status(httpStatus.NOT_FOUND).json({ msg: "No user found" });
    }
    res.status(httpStatus.OK).json({ user: blockedUsers });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong" });
    console.log(error);
  }
};

//! oder code
// const getSystemRights = async (req, res) => {
//   try {
//     // const { adminsRecordId } = req.params;
//     const { id } = req.params;

//      // Validate ObjectId
//   if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: "Invalid or missing id parameter" });
//   }

//     // Find the admin record by ID
//     const userFromAdminsRecord = await AdminModel.findOne({
//       // _id: adminsRecordId,
//       _id: id,
//     });
//     if (!userFromAdminsRecord) {
//       return res.status(404).json({ error: "Admin record not found" });
//     }

//     // Populate the `refId` field dynamically using the `refType` as the model
//     const populatedUser = await AdminModel.findOne({
//       email: userFromAdminsRecord.email,
//     }).populate({
//       path: "refId",
//       model: userFromAdminsRecord.refType, // Dynamically use the model
//     });

//     // Check if `refId` and `systemRights` exist
//     const systemRights = populatedUser?.refId?.systemRights || {};

//     // Send the system rights in the response
//     return res.status(200).json({
//       success: true,
//       message: "System rights retrieved successfully",
//       systemRights,
//     });
//   } catch (error) {
//     console.error("Error fetching system rights:", error);
//     return res.status(500).json({
//       success: false,
//       error: "Internal server error",
//       details: error.message,
//     });
//   }
// };

//todo: new code|

const getSystemRights = async (req, res) => {
  try {
    const { id } = req.params;

    // console.log("🔍 Received ID:", id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing id parameter" });
    }

    const userFromAdminsRecord = await AdminModel.findById(id);

    if (!userFromAdminsRecord) {
      // console.log("❌ Admin record not found for ID:", id);
      return res.status(404).json({ error: "Admin record not found" });
    }

    // Populate the refId from the refType model
    const populatedUser = await AdminModel.findOne({
      email: userFromAdminsRecord.email,
    }).populate({
      path: "refId",
      model: userFromAdminsRecord.refType,
    });

    const systemRights = populatedUser?.refId?.systemRights || {};

    return res.status(200).json({
      success: true,
      message: "System rights retrieved successfully",
      systemRights,
    });
  } catch (error) {
    console.error("🔥 Error in getSystemRights:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

const fetchUserSuspensionStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by `refId`
    const user = await AdminModel.findOne({ refId: id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Extract suspension status
    const isSuspended = user.isBlocked;

    // Send the response
    return res.status(200).json({
      success: true,
      isSuspended,
    });
  } catch (error) {
    console.error("Error fetching user suspension status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateUserSuspensionStatus = async (req, res) => {
  try {
    const { userId, isSuspended } = req.body;

    // Validate input
    if (!userId || typeof isSuspended !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid input. userId and isSuspended are required.",
      });
    }

    // Find and update the user's suspension status
    const updatedUser = await AdminModel.findOneAndUpdate(
      { refId: userId },
      { isBlocked: isSuspended },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Respond with success and updated status
    return res.status(200).json({
      success: true,
      message: "Suspension status updated successfully.",
      isSuspended: updatedUser.isBlocked,
    });
  } catch (error) {
    console.error("Error updating suspension status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const getSystemRightsById = async (req, res) => {
  // console.log("getSystemRightsById called");
  try {
    const { id } = req.params;

    // Find the admin record by ID
    const userFromAdminsRecord = await AdminModel.findOne({
      _id: id,
    });
    if (!userFromAdminsRecord) {
      return res.status(404).json({ error: "Admin record not found" });
    }

    // Populate the `refId` field dynamically using the `refType` as the model
    const populatedUser = await AdminModel.findOne({
      email: userFromAdminsRecord.email,
    }).populate({
      path: "refId",
      model: userFromAdminsRecord.refType, // Dynamically use the model
    });

    // console.log("populatedUser", populatedUser);
    // Check if `refId` and `systemRights` exist
    const systemRights = populatedUser?.refId?.systemRights || {};

    // Send the system rights in the response
    return res.status(200).json({
      success: true,
      message: "System rights retrieved successfully",
      systemRights,
      populatedUser,
    });
  } catch (error) {
    console.error("Error fetching system rights:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

//todo: change password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // ✅ Get adminId from decoded token
    const adminId = req.user?.adminId; // Assuming handleToken middleware decodes the token and attaches adminId to req.user

    if (!adminId) {
      return res.status(401).json({ msg: "Unauthorized. Invalid token." });
    }

    // ✅ Fetch full admin from DB
    const admin = await AdminModel.findById(adminId);
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    // ✅ Check old password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Old password is incorrect" });
    }

    // ✅ Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    return res.status(200).json({ msg: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const verifyAndSendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await AdminModel.findOne({ email: email });
    if (!admin) {
      return res.status(404).json({ msg: "Email not found" });
    }

    // generate otp
    const otp = crypto.randomInt(100000, 999999);

    // save otp with expiry
    admin.resetOtp = otp;
    admin.resetOtpExpires = Date.now() + 10 * 60 * 1000; // valid for 10 mins
    await admin.save();

    const transporter = nodemailer.createTransport({
      host: "amikasoftwares.com", // MX record says domain itself
      port: 587, // try 587 first (TLS)
      secure: false, // false for 587, true if you switch to 465
      auth: {
        user: "mirai@amikasoftwares.com",
        pass: "Amika@123",
      },
      tls: {
        rejectUnauthorized: false, // allow if server uses self-signed SSL
      },
    });

    const mailOptions = {
      from: "mirai@amikasoftwares.com",
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP is: ${otp}. Valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      msg: `Otp Send on ${email}`,
    });
  } catch (error) {
    console.error("Error sending otp for forget password:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    // console.log(otp);
    // console.log(email);

    // ✅ Find admin by email
    const admin = await AdminModel.findOne({ email: email });
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    // ✅ Check OTP
    if (!admin.resetOtp || !admin.resetOtpExpires) {
      return res.status(400).json({ msg: "OTP not requested or expired" });
    }

    if (String(admin.resetOtp) !== String(otp)) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    if (Date.now() > admin.resetOtpExpires) {
      return res.status(400).json({ msg: "OTP has expired" });
    }

    // ✅ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;

    // ✅ Clear OTP fields
    admin.resetOtp = undefined;
    admin.resetOtpExpires = undefined;

    await admin.save();

    return res.status(200).json({ msg: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password with OTP:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAllAdmin,
  getAdmin,
  deleteAdmin,
  blockAdmin,
  unblockAdmin,
  getBlockedAdmin,
  getSystemRights,
  fetchUserSuspensionStatus,
  updateUserSuspensionStatus,
  getSystemRightsById,
  changePassword,
  verifyAndSendOtp,
  resetPasswordWithOtp,
};
