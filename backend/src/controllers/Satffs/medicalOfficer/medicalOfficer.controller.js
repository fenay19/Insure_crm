const { MedicalOfficer, AdminModel } = require('../../../models')
const { CompanySetupModel } = require('../../../models')
const { SaveCredentials } = require('../HelperFunctions/SavedCredential')
const checkDuplicateFields = require('../HelperFunctions/CheckDuplicateEntries')
const { emitRightsUpdated } = require('../../../utils/socket')

const createBasicDetails = async (req, res) => {
  try {
    const { contactNumber, email, adharNumber } = req.body;

    // Check for duplicate entries
    const errorMessage = await checkDuplicateFields(MedicalOfficer, {
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

    // Create a new basic details entry
    const newBasicDetails = new MedicalOfficer({
      basicDetails: basicDetails,
    });

    // Save basic details in the database
    const savedBasicDetails = await newBasicDetails.save();

    // Create user credentials
    const createUserCredentials = await SaveCredentials(
      savedBasicDetails,
      "MedicalOfficer",
      "MedicalOfficer"
    );

    if (!createUserCredentials) {
      // Rollback saved basic details if credential creation fails
      await MedicalOfficer.findByIdAndDelete(savedBasicDetails._id);

      return res.status(500).json({
        success: false,
        message:
          "Failed to create user credentials. Rolled back basic details.",
      });
    }

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

const updateBasicDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const existingBasicDetails = await MedicalOfficer.findById(id);

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

    const updatedDocument = await MedicalOfficer.findByIdAndUpdate(
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
    const updatedDocument = await MedicalOfficer.findByIdAndUpdate(
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

// const updateEmploymentDetails = async (req, res) => {
//   const { id } = req.params
//   const { employmentDetails } = req.body

//   if (Object.keys(employmentDetails).length === 0) {
//     return res.status(400).json({
//       success: false,
//       message: 'Please fill the data'
//     })
//   }

//   // Fields that require ObjectId and need null if empty
//   const objectIdFields = [
//     'departmentOrSpeciality',
//     'empRole',
//     'designation',
//     'reportTo'
//   ]

//   // Preprocess employmentDetails
//   const sanitizedEmploymentDetails = { ...employmentDetails }

//   objectIdFields.forEach(field => {
//     if (sanitizedEmploymentDetails[field] === '') {
//       sanitizedEmploymentDetails[field] = null
//     }
//   })

//   try {
//     const updatedDocument = await MedicalOfficer.findByIdAndUpdate(
//       id,
//       { $set: { employmentDetails: sanitizedEmploymentDetails } },
//       { new: true }
//     )

//     if (!updatedDocument) {
//       return res.status(404).json({
//         success: false,
//         message: 'Document not found'
//       })
//     }

//     res.status(200).json({
//       success: true,
//       data: updatedDocument,
//       message: 'Employment Details updated successfully'
//     })
//   } catch (error) {
//     console.error('Error in updating employment details:', error)

//     res.status(500).json({
//       success: false,
//       message: 'Failed to update employment details',
//       error: error.message
//     })
//   }
// }
const updateEmploymentDetails = async (req, res) => {
  const { id } = req.params;
  const { employmentDetails } = req.body;

  if (Object.keys(employmentDetails).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please fill the data",
    });
  }

  // Fields that require ObjectId and need null if empty
  const objectIdFields = ["empRole", "designation", "reportTo"];

  // Preprocess employmentDetails
  const sanitizedEmploymentDetails = { ...employmentDetails };

  objectIdFields.forEach((field) => {
    if (sanitizedEmploymentDetails[field] === "") {
      sanitizedEmploymentDetails[field] = null;
    }
  });

  // Handle departmentOrSpeciality as array
  if (
    Array.isArray(sanitizedEmploymentDetails.departmentOrSpeciality) &&
    sanitizedEmploymentDetails.departmentOrSpeciality.length === 0
  ) {
    sanitizedEmploymentDetails.departmentOrSpeciality = [];
  }

  try {
    const updatedDocument = await MedicalOfficer.findByIdAndUpdate(
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

const updateQualification = async (req, res) => {
  const { id } = req.params;
  const { qualificationForm } = req.body;

  if (Object.keys(qualificationForm).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please fill the data",
    });
  }

  // Fields that require ObjectId and need null if empty
  const objectIdFields = [
    "diploma",
    "graduation",
    "postGraduation",
    "superSpecialization",
  ];

  // Preprocess qualificationForm to replace empty strings or undefined with null for specific fields
  const sanitizedQualificationForm = { ...qualificationForm };

  objectIdFields.forEach((field) => {
    if (
      !sanitizedQualificationForm[field] ||
      sanitizedQualificationForm[field].length === 0
    ) {
      sanitizedQualificationForm[field] = [];
    }
  });

  try {
    const updatedDocument = await MedicalOfficer.findByIdAndUpdate(
      id,
      { $set: { qualification: sanitizedQualificationForm } },
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
      message: "Qualification Details updated successfully",
    });
  } catch (error) {
    console.log("Error in updating qualification details", error);

    res.status(500).json({
      success: false,
      message: "Failed to update qualification details",
      error: error.message,
    });
  }
};

const updateAdditionalDetails = async (req, res) => {
  const { id } = req.params;
  const { additionalDetailsForm } = req.body;

  if (Object.keys(additionalDetailsForm).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please fill the data",
    });
  }

  // Fields that require ObjectId and need null if empty
  const objectIdFields = ["verifiedBy"];

  // Preprocess additionalDetailsForm to replace empty strings or undefined with null for specific fields
  const sanitizedAdditionalDetailsForm = { ...additionalDetailsForm };

  objectIdFields.forEach((field) => {
    if (!sanitizedAdditionalDetailsForm[field]) {
      sanitizedAdditionalDetailsForm[field] = null;
    }
  });

  // Ensure `registrationNo`, `councilName`, and `date` are strings (empty string if missing)
  const stringFields = ["registrationNo", "councilName", "date", "time"];

  stringFields.forEach((field) => {
    if (typeof sanitizedAdditionalDetailsForm[field] !== "string") {
      sanitizedAdditionalDetailsForm[field] = ""; // Set to empty string if missing or not a string
    }
  });

  try {
    const updatedDocument = await MedicalOfficer.findByIdAndUpdate(
      id,
      { $set: { additionalDetails: sanitizedAdditionalDetailsForm } },
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
      message: "Additional Details updated successfully",
    });
  } catch (error) {
    console.log("Error in updating additional details", error);

    res.status(500).json({
      success: false,
      message: "Failed to update additional details",
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

    const existingDocument = await MedicalOfficer.findById(id);

    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const documentationMap = existingDocument.documentation || new Map();

    documentation.forEach((file) => {
      documentationMap.set(file.fieldname, file.filename);
    });

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

const updateHrFinanceDetails = async (req, res) => {
  const { id } = req.params;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please fill the details",
    });
  }

  try {
    const existingDocument = await MedicalOfficer.findById(id);

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

    const updatedDocument = await MedicalOfficer.findByIdAndUpdate(
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

const getAllMedicalOfficers = async (req, res) => {
  try {
    const medicalOfficerData = await MedicalOfficer.find({
      delete: false,
    })
      .populate({
        path: "employmentDetails.departmentOrSpeciality",
        select: "departmentName",
      })
      .populate({
        path: "employmentDetails.designation",
        select: "designationName",
      });

    if (medicalOfficerData && medicalOfficerData.length > 0) {
      return res.status(200).json({
        status: 200,
        msg: "Medical Officer data found",
        data: medicalOfficerData,
      });
    } else {
      return res.status(404).json({
        status: 404,
        msg: "No medical officer data found",
      });
    }
  } catch (error) {
    console.error("Error fetching medical officer data:", error);
    return res.status(500).json({
      status: 500,
      msg: "Server error, please try again later",
    });
  }
};

const getMedicalOfficerDataById = async (req, res) => {
  try {
    const { id } = req.params;

    const medicalOfficerData = await MedicalOfficer.findOne({
      _id: id,
      delete: false,
    });

    if (medicalOfficerData) {
      return res.status(200).json({
        status: 200,
        success: true,
        msg: "Medical Officer data found",
        data: medicalOfficerData,
      });
    } else {
      return res.status(404).json({
        status: 404,
        success: false,
        msg: "No medical officer data found for the given Id",
      });
    }
  } catch (error) {
    console.error("Error fetching medical officer data by ID:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      msg: "Server error, please try again later",
    });
  }
};

const getMedicalOfficerDataForReportTo = async (req, res) => {
  try {
    const medicalOfficerData = await MedicalOfficer.find(
      {},
      { _id: 1, "basicDetails.firstName": 1, "basicDetails.lastName": 1 }
    );

    if (medicalOfficerData && medicalOfficerData.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Medical officer Data found",
        data: medicalOfficerData,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No medical officer data found",
        data: [],
      });
    }
  } catch (error) {
    console.error("Error fetching medical officer data:", error);
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

    const prefix = `${hospitalPrefix}MO`;

    const lastRecord = await MedicalOfficer.findOne()
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

const deleteMedicalOfficer = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    const deletedUser = await MedicalOfficer.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "No medical officer record found with the given ID",
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
      message: "Medical Officer record deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting medical officer record or credentials:",
      error
    );
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while deleting the medical officer record or credentials",
      error: error.message,
    });
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
    const existingRecord = await MedicalOfficer.findById(id);

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
  createBasicDetails,
  updateBasicDetails,
  updatePastEmploymentDetails,
  updateEmploymentDetails,
  updateAdditionalDetails,
  updateQualification,
  updateHrFinanceDetails,
  updateDocuments,

  getAllMedicalOfficers,
  getMedicalOfficerDataById,
  getMedicalOfficerDataForReportTo,
  generateEmpCode,
  deleteMedicalOfficer,
  createSystemRights,
};
