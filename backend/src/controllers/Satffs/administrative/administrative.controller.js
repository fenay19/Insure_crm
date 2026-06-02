const { Administrative, AdminModel } = require("../../../models");
const { SaveCredentials } = require("../HelperFunctions/SavedCredential");
const checkDuplicateFields = require("../HelperFunctions/CheckDuplicateEntries");
const { CompanySetupModel } = require("../../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const createBasicDetails = async (req, res) => {
  try {
    const { contactNumber, email, adharNumber } = req.body;
    const { companyId } = req.query;

    // Check for duplicates
    const errorMessage = await checkDuplicateFields(Administrative, {
      contactNumber,
      email,
      adharNumber,
    });

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    // Prepare basic details
    const basicDetails = {
      ...req.body,
      profilePhoto: req.file ? req.file.filename : null,
    };

    console.log("Bknd Basic details : ", basicDetails);

    if (typeof basicDetails.emergencyContacts === "string") {
      try {
        basicDetails.emergencyContacts = JSON.parse(
          basicDetails.emergencyContacts
        );
      } catch (e) {
        basicDetails.emergencyContacts = [];
      }
    }
    // Create new basic details entry
    const newBasicDetails = new Administrative({
      companyId,
      basicDetails: basicDetails,
    });

    console.log("Bknd New Basic details : ", newBasicDetails);
    // Save basic details in the database
    const savedBasicDetails = await newBasicDetails.save();

    //todo: Save stafff credentials in AdminModel
    // loop basicDetails to get the firstName & lastName into single varible
    let fullName = "";
    if (savedBasicDetails?.basicDetails) {
      const { firstName, lastName } = savedBasicDetails.basicDetails;
      fullName = `${firstName || ""} ${lastName || ""}`.trim();
      console.log("full Name: ", fullName);
    }
    console.log("fully basic detail name", fullName);
    // contactNumber, email:
    const hashedPassword = await bcrypt.hash(contactNumber, 10);
    const newStaff = new AdminModel({
      name: fullName, // firstName & lastName
      email: email,
      password: hashedPassword,
      role: "staff", //staff
      isBlocked: false,
      refId: savedBasicDetails._id,
      refType: "Administrative",
    });
    await newStaff.save();

    console.log("New staff registration created:", newStaff);

    // Create user credentials
    // const CreateUserCredentials = await SaveCredentials(
    //   savedBasicDetails,
    //   "Administrative",
    //   "Administrative"
    // );

    // if (!CreateUserCredentials) {
    //   // Rollback saved basic details if credential creation fails
    //   await Administrative.findByIdAndDelete(savedBasicDetails._id);

    //   return res.status(500).json({
    //     success: false,
    //     message:
    //       "Failed to create user credentials. Rolled back basic details.",
    //   });
    // }

    // Return success response
    res.status(201).json({
      success: true,
      data: savedBasicDetails,
      message: "Basic details created and credentials saved successfully.",
    });
  } catch (error) {
    console.error("Error creating basic details:", error);

    // Return error response
    res.status(500).json({
      success: false,
      message: "Failed to create basic details.",
      error: error.message,
    });
  }
};

//todo: Login staff credential controller
const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find staff in AdminModel
    const staff = await AdminModel.findOne({ email });
    if (!staff) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // 2. Check if role is 'staff'
    if (staff.role !== "staff") {
      return res.status(403).json({ msg: "You are not authorized as staff." });
    }

    // 2. Check if blocked
    if (staff.isBlocked) {
      return res.status(403).json({ msg: "Your account is blocked" });
    }

    // 3. Validate password
    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // 4. Generate JWT token
    // const token = jwt.sign(
    //   { staffId: staff._id, branchId: staff.refId,},
    //   "Bearar"
    // );
    const token = jwt.sign(
      {
        staffId: staff._id,
        branchId: staff.refId,
        role: staff.role, // Include role for later checks
        // systemRight: populatedUser?.refId?.systemRights || [] // Include rights so backend can check access
      },
      process.env.JWT_SECRET_KEY, // ✅ same as in handleToken
      { expiresIn: "7d" } // Optional expiry
    );

    // 5. Populate refId with Administrative details
    const populatedUser = await AdminModel.findOne({ email }).populate({
      path: "refId",
      model: staff.refType, // 'Administrative'
      populate: [
        {
          path: "employmentDetails.departmentOrSpeciality",
          model: "DepartmentSetup",
          options: { strictPopulate: false },
        },
      ],
    });

    // 6. Extract department info safely
    const { departmentName, _id: departmentId } =
      populatedUser?.refId?.employmentDetails?.departmentOrSpeciality || {};

    const admindata = await AdminModel.findById(
      populatedUser?.refId?.companyId
    ).populate({
      path: "refId",
      model: "clientRegistration",
      // populate: [
      //   {
      //     path: "employmentDetails.departmentOrSpeciality",
      //     model: "DepartmentSetup",
      //     options: { strictPopulate: false },
      //   },
      // ],
    });

    // console.log(admindata.refId.endDate);

    // 7. Response payload
    const responseData = {
      msg: `Welcome ${staff.name}`,
      token,
      staffId: staff._id,
      email: staff.email,
      name: staff.name,
      role: staff.role, // should be'staff'
      login: staff,
      departmentName: departmentName || "",
      departmentId: departmentId || "",
      empCode: populatedUser?.refId?.basicDetails?.empCode || "",
      systemRight: populatedUser?.refId?.systemRights || {},
      companyId: populatedUser?.refId?.companyId,
      empId: populatedUser?.refId?._id,
      endDate: admindata?.refId?.endDate,
    };

    // console.log("staff response data:", responseData);
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Staff login error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

function cleanBankField(field) {
  if (Array.isArray(field)) field = field[0];
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      if (typeof parsed === "string") return parsed;
      if (Array.isArray(parsed)) return parsed[0] || "";
    } catch (e) {}
    return field;
  }
  return field || "";
}

const updateBasicDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const existingBasicDetails = await Administrative.findById(id);

    if (!existingBasicDetails) {
      return res.status(404).json({
        success: false,
        message: "Basic details not found.",
      });
    }

    const basicDetails = {
      ...req.body,
      profilePhoto: req.file
        ? req.file.filename
        : existingBasicDetails.basicDetails.profilePhoto,
    };

    // Defensive clean for bank fields
    basicDetails.bankAccountNumber = cleanBankField(
      basicDetails.bankAccountNumber
    );
    basicDetails.bankName = cleanBankField(basicDetails.bankName);
    basicDetails.branchName = cleanBankField(basicDetails.branchName);

    // Handle emergencyContacts as array
    if (typeof basicDetails.emergencyContacts === "string") {
      try {
        basicDetails.emergencyContacts = JSON.parse(
          basicDetails.emergencyContacts
        );
      } catch (e) {
        basicDetails.emergencyContacts = [];
      }
    }

    const updatedDocument = await Administrative.findByIdAndUpdate(
      id,
      { $set: { basicDetails: basicDetails } },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: "No document found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Basic details updated successfully",
      data: updatedDocument,
    });
  } catch (error) {
    console.error("Error updating basic details:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update basic details.",
      error: error.message,
    });
  }
};

const updatePastEmploymentDetails = async (req, res) => {
  const { id } = req.params;
  const { pastEmploymentData } = req.body;

  try {
    const updatedDocument = await Administrative.findByIdAndUpdate(
      id,
      { $set: { pastEmploymentDetails: pastEmploymentData } },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedDocument,
      message: "Past employment details updated ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update the past employement details",
      error: error.message,
    });
  }
};

const updateEmploymentDetails = async (req, res) => {
  const { id } = req.params;
  const { employmentDetails } = req.body;

  if (Object.keys(employmentDetails).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please fill the data",
    });
  }

  // Fields that require ObjectId
  const objectIdFields = [
    "departmentOrSpeciality",
    "empRole",
    "designation",
    "reportTo",
  ];

  // Preprocess employmentDetails to replace empty strings with null only for specific fields
  const sanitizedEmploymentDetails = { ...employmentDetails };

  objectIdFields.forEach((field) => {
    if (sanitizedEmploymentDetails[field] === "") {
      sanitizedEmploymentDetails[field] = null;
    }
  });

  try {
    const updatedDocument = await Administrative.findByIdAndUpdate(
      id,
      { $set: { employmentDetails: sanitizedEmploymentDetails } },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedDocument,
      message: "Employment Details updated successfully",
    });
  } catch (error) {
    console.error("Error in updating employment details:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update employment details",
      error: error.message,
    });
  }
};

const updateDocuments = async (req, res) => {
  const { id } = req.params;

  try {
    const documentation = req.files || [];

    if (!documentation || documentation.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const existingDocument = await Administrative.findById(id);

    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // ✅ Step 1: Ensure documentation is a valid object
    let documentationMap = {};

    if (
      existingDocument.documentation &&
      typeof existingDocument.documentation === "object" &&
      !Array.isArray(existingDocument.documentation)
    ) {
      documentationMap = { ...existingDocument.documentation };
    }

    // ✅ Step 2: Add/replace only uploaded files
    documentation.forEach((file) => {
      documentationMap[file.fieldname] = file.filename;
    });

    // ✅ Step 3: Save updated document
    existingDocument.documentation = documentationMap;
    await existingDocument.save();

    res.status(200).json({
      success: true,
      message: "Documents updated successfully",
      data: existingDocument,
    });
  } catch (error) {
    console.error("Error in updating documents:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update documents.",
      error: error.message,
    });
  }
};

// Education Details

const createOrUpdateEducation = async (req, res) => {
  const { id } = req.params;
  const { qualification, yearOfPassing, universityOrBoard } = req.body;

  try {
    const admin = await Administrative.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Administrative record not found",
      });
    }

    // ✅ Replace old educationDetails array with new one-entry array
    admin.educationDetails = [
      {
        qualification,
        yearOfPassing,
        universityOrBoard,
      },
    ];

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Education details saved successfully",
      data: admin.educationDetails,
    });
  } catch (error) {
    console.error("Error saving education:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save education details",
      error: error.message,
    });
  }
};

const updateHrFinanceDetails = async (req, res) => {
  const { id } = req.params;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please fill the details",
    });
  }

  try {
    const existingDocument = await Administrative.findById(id);

    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const currentBankDetails = existingDocument.hrFinance || {};

    const hrFinance = {
      ...req.body,
      cancelCheck: req.file
        ? req.file.filename
        : currentBankDetails.cancelCheck || null,
    };

    const updatedDocument = await Administrative.findByIdAndUpdate(
      id,
      { $set: { hrFinance: hrFinance } },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: "Failed to update Document not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedDocument,
      message: "Hr finance updated successfully",
    });
  } catch (error) {
    console.error("Error updating Hr Finance:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update hr finance.",
      error: error.message,
    });
  }
};

const updateSalaryAndWagesDetails = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  console.log("Received body:", JSON.stringify(body, null, 2));

  try {
    const existingDocument = await Administrative.findById(id).populate(
      "employmentDetails.position"
    );

    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        message: "Document not found, please provide a valid id",
      });
    }

    // Deep merge salaryAndWages
    const currentSalary = existingDocument.salaryAndWages || {};
    const updatedSalary = {
      ...currentSalary,
      ...body,
      incomeDetails: {
        ...currentSalary.incomeDetails,
        ...body.incomeDetails,
      },
      deductionDetails: {
        ...currentSalary.deductionDetails,
        ...body.deductionDetails,
      },
    };

    // Update the document
    existingDocument.salaryAndWages = updatedSalary;
    const savedDoc = await existingDocument.save();

    console.log("Updated salaryAndWages:", savedDoc.salaryAndWages);

    return res.status(200).json({
      success: true,
      message: "Salary and Wages updated successfully.",
      data: savedDoc.salaryAndWages,
    });
  } catch (error) {
    console.error("Error updating Salary and Wages:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update Salary and Wages.",
      error: error.message,
    });
  }
};

const updateSystemRights = async (req, res) => {
  const { id } = req.params;
  const { authorizedIds, actionPermissions } = req.body;

  if (!authorizedIds && !actionPermissions) {
    return res.status(400).json({
      success: false,
      message: "Please provide module and permissions to update.",
    });
  }

  try {
    const existingDocument = await Administrative.findById(id);

    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const updatedDocument = await Administrative.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(authorizedIds && { "systemRights.authorizedIds": authorizedIds }),
          ...(actionPermissions && {
            "systemRights.actionPermissions": actionPermissions,
          }),
        },
      },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: "Failed to update system rights. Document not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedDocument,
      message: "System rights updated successfully",
    });
  } catch (error) {
    console.error("Error updating system rights:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update system rights",
      error: error.message,
    });
  }
};

const getAllAdministrativeData = async (req, res) => {
  try {
    const { companyId } = req.query;

    const administrativeData = await Administrative.find({
      delete: false,
      companyId: new mongoose.Types.ObjectId(companyId),
    })
      .populate("employmentDetails.department")
      .populate("employmentDetails.position")
      .populate("basicDetails.prefix")
      .sort({ createdAt: -1 });

    if (administrativeData && administrativeData.length > 0) {
      return res.status(200).json({
        status: 200,
        msg: "Administrative data found",
        data: administrativeData,
      });
    } else {
      return res.status(404).json({
        status: 404,
        msg: "No administrative data found",
      });
    }
  } catch (error) {
    console.error("Error fetching administrative data:", error);
    return res.status(500).json({
      status: 500,
      msg: "Server error, please try again later",
    });
  }
};

const getAdministrativeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the record by ID and ensure `delete` is false
    const administrativeData = await Administrative.findOne({
      _id: id,
      delete: false,
    })
      .populate("employmentDetails.department")
      .populate("employmentDetails.position")
      .populate("basicDetails.prefix");

    if (administrativeData) {
      return res.status(200).json({
        status: 200,
        success: true,
        msg: "Administrative data found",
        data: administrativeData,
      });
    } else {
      return res.status(404).json({
        status: 404,
        success: false,
        msg: "No administrative data found for the given ID",
      });
    }
  } catch (error) {
    console.error("Error fetching administrative data by ID:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      msg: "Server error, please try again later",
    });
  }
};

const getAdministrativeForReportTo = async (req, res) => {
  try {
    const administrativeData = await Administrative.find(
      {},
      { _id: 1, "basicDetails.firstName": 1, "basicDetails.lastName": 1 }
    );

    if (administrativeData && administrativeData.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Administrative Data found",
        data: administrativeData,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No administrative data found",
        data: [],
      });
    }
  } catch (error) {
    console.error("Error fetching administrative data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const generateEmpCode = async (req, res) => {
  try {
    const companySetup = await CompanySetupModel.findOne(
      {},
      { hospitalName: 1 }
    );
    if (!companySetup || !companySetup.hospitalName) {
      return res.status(404).json({
        success: false,
        message: "Hospital name not found in the database",
      });
    }

    const hospitalName = companySetup.hospitalName.trim().split(" ");
    const hospitalPrefix =
      hospitalName.length >= 2
        ? `${hospitalName[0][0].toUpperCase()}${hospitalName[1][0].toUpperCase()}`
        : `${hospitalName[0][0].toUpperCase()}X`;

    const prefix = `${hospitalPrefix}AD`;

    const lastRecord = await Administrative.findOne()
      .sort({ "basicDetails.empCode": -1 })
      .select("basicDetails.empCode");

    let nextNumber = 1;
    if (lastRecord && lastRecord.basicDetails.empCode) {
      const lastEmpCode = lastRecord.basicDetails.empCode;
      const numericPart = parseInt(lastEmpCode.replace(prefix, ""), 10);
      if (!isNaN(numericPart)) {
        nextNumber = numericPart + 1;
      }
    }

    const newEmpCode = `${prefix}${nextNumber.toString().padStart(3, "0")}`;

    res.status(200).json({
      success: true,
      empCode: newEmpCode,
      message: "Employee code generated successfully",
    });
  } catch (error) {
    console.error("Error generating empCode:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate empCode",
      error: error.message,
    });
  }
};

const deleteAdministrative = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    const deletedUser = await Administrative.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "No administrative record found with the given ID",
      });
    }

    const deletedCredentials = await AdminModel.findOneAndDelete({ refId: id });

    if (!deletedCredentials) {
      return res.status(404).json({
        success: false,
        message: "No crendentials found for the user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Administrative record deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting administrative record or credentials:",
      error
    );
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while deleting the administrative record or credentials",
      error: error.message,
    });
  }
};

//todo: employee code generate
// Generate next employee code like AD001, AD002, ...
// const generateEmployeeCode = async (req, res) => {
//   try {
//     // Find the latest empCode that matches AD###
//     const latest = await Administrative.findOne({
//       empCode: { $regex: "^AD\\d{3}$" },
//     })
//       .sort({ empCode: -1 })
//       .lean();

//     console.log("Latest", latest);
//     let nextNumber = 1;
//     if (latest && latest.empCode) {
//       const num = parseInt(latest.empCode.replace("AD", ""), 10);
//       if (!isNaN(num)) nextNumber = num + 1;
//     }
//     const empCode = `AD${String(nextNumber).padStart(3, "0")}`;
//     console.log("empCode", empCode);
//     res.json({ success: true, empCode });
//   } catch (err) {
//     console.error("Error in generateEmployeeCode:", err);

//     res
//       .status(500)
//       .json({ success: false, message: "Error generating employee code" });
//   }
// };

//! new code
// const generateEmployeeCode = async (req, res) => {
//   try {
//     // Case-insensitive match, find any empCode starting with AD followed by digits
//     const latest = await Administrative.findOne({
//       empCode: { $regex: /^AD\d+$/, $options: 'i' },
//     })
//       .sort({ empCode: -1 })
//       .lean();

//     console.log("Latest", latest);

//     let nextNumber = 1;

//     if (latest && latest.empCode) {
//       // Extract number from the latest empCode
//       const match = latest.empCode.match(/\d+$/);
//       if (match) {
//         const num = parseInt(match[0], 10);
//         if (!isNaN(num)) nextNumber = num + 1;
//       }
//     }

//     const empCode = `AD${String(nextNumber).padStart(3, "0")}`;
//     console.log("Generated empCode:", empCode);

//     res.json({ success: true, empCode });
//   } catch (err) {
//     console.error("Error in generateEmployeeCode:", err);
//     res.status(500).json({ success: false, message: "Error generating employee code" });
//   }
// };

//! 1
const generateEmployeeCode = async (req, res) => {
  try {
    // const allRecords = await Administrative.find({}, { empCode: 1 }).lean();
    const allRecords = await Administrative.find().lean();
    // Extract valid AD### codes and parse numbers
    const numbers = allRecords
      .map((record) => record.basicDetails?.empCode)
      .filter((code) => /^AD\d+$/.test(code))
      .map((code) => parseInt(code.replace("AD", ""), 10));

    console.log("Extracted numbers:", numbers);

    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNumber = maxNumber + 1;

    console.log("next number:", nextNumber);

    const empCode = `AD${String(nextNumber).padStart(3, "0")}`;
    console.log("Generated empCode:", empCode);

    res.json({ empCode });
  } catch (err) {
    console.error("Error generating employee code:", err);
    res.status(500).json({ success: false, message: "Error generating code" });
  }
};

module.exports = {
  createBasicDetails,
  loginStaff,
  updateBasicDetails,
  updatePastEmploymentDetails,
  updateEmploymentDetails,
  updateHrFinanceDetails,
  updateSalaryAndWagesDetails,
  updateDocuments,
  createOrUpdateEducation,
  updateSystemRights,
  getAllAdministrativeData,
  getAdministrativeById,
  getAdministrativeForReportTo,
  generateEmpCode,
  deleteAdministrative,
  generateEmployeeCode,
};
