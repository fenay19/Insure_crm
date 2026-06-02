const httpStatus = require("http-status");
const { OPDPackageModel } = require("../../models");

const createOPDPackages = async (req, res) => {
  try {
    const {
      services = [],
      diagnostics = [],
      radiologies = [],
      pathologyTest = [],
      pathologyProfile = [],
      DepartmentConsultants = [],
      ...packageFields
    } = req.body;

    console.log("OPD Package creation data:", req.body);

    const requiredFields = [
      "opdPackageName",
      "visit",
      "department",
      "serviceCode",
    ];

    const missing = requiredFields.filter((field) => !packageFields[field]);

    if (missing.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    const mergedConsultantsMap = {};

    DepartmentConsultants.forEach(({ departmentId, consultants }) => {
      if (!mergedConsultantsMap[departmentId]) {
        mergedConsultantsMap[departmentId] = new Set();
      }
      consultants.forEach((consultant) =>
        mergedConsultantsMap[departmentId].add(consultant)
      );
    });

    const mergedDepartmentConsultants = Object.entries(
      mergedConsultantsMap
    ).map(([departmentId, consultantsSet]) => ({
      departmentId,
      consultants: [...consultantsSet], // Convert Set back to array to remove duplicates
    }));
    console.log(
      "mergedDepartmentConsultants--------",
      mergedDepartmentConsultants
    );
    const opdPackage = new OPDPackageModel({
      ...packageFields,
      othersServices: {
        services,
        pathologyProfile: pathologyProfile,
        pathologyTest: pathologyTest,
        radiology: radiologies,
        otherDiagnostics: diagnostics,
      },
      DepartmentConsultants: mergedDepartmentConsultants,
    });

    await opdPackage.save();

    console.log("2----");
    res.status(httpStatus.CREATED).json({
      msg: "OPD Package created successfully",
      package: opdPackage,
    });
  } catch (error) {
    console.error("❌ OPD Package creation error:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to create OPD Package",
      error: error.message,
    });
  }
};

const getAllOPDPackages = async (req, res) => {
  try {
    const package = await OPDPackageModel.find({ delete: false })
      .sort({ createdAt: -1 })
      .populate({
        path: "DepartmentConsultants.departmentId",
        select: "departmentName",
      })
      .populate({
        path: "DepartmentConsultants.consultants",
        select: "basicDetails", // ✅ select whole object
      })
      .lean();
    if (!package) {
      return res.status(500).json({ err: "Error in finding OPD Packages" });
    }
    return res
      .status(httpStatus.OK)
      .json({ msg: "All OPD Packages found successfully", package });
  } catch (error) {
    res.status(500).json({ err: "Server Error", error });
  }
};

// const editOPDPackages = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const package = await OPDPackageModel.findByIdAndUpdate(
//       { _id: id },
//       { ...req.body,
//         othersServices: {
//           services: req.body.services,
//           pathology: req.body.pathology,
//           radiology: req.body.radiology,
//           otherDiagnostics: req.body.otherDiagnostics,
//         },
//         DepartmentConsultants: req.body.DepartmentConsultants,
//        },
//       { new: true }
//     );

//     if (!package) {
//       return res.status(400).json({ msg: "OPD Package not found" });
//     }
//     await package.save();
//     return res
//       .status(httpStatus.OK)
//       .json({ msg: "OPD Package updated successfully", package });
//   } catch (error) {
//     res.status(500).json({ err: "Server Error", error });
//   }
// };
const editOPDPackages = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedPackage = await OPDPackageModel.findByIdAndUpdate(
      id,
      {
        ...req.body,
        othersServices: {
          services: req.body.services,
          pathologyTest: req.body.pathologyTest,
          pathologyProfile: req.body.pathologyProfile,
          radiology: req.body.radiologies,
          otherDiagnostics: req.body.diagnostics,
        },
        DepartmentConsultants: req.body.DepartmentConsultants,
      },
      { new: true }
    );

    if (!updatedPackage) {
      return res.status(400).json({ msg: "OPD Package not found" });
    }

    return res.status(200).json({
      msg: "OPD Package updated successfully",
      package: updatedPackage,
    });
  } catch (error) {
    console.error("Error updating OPD Package:", error);
    return res.status(500).json({ err: "Server Error", error });
  }
};

const updateOpdPackageRateAndCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { rate, newCode } = req.body;
    console.log("RAYE", rate, newCode);
    // Check if `rate` or `newCode` is provided
    if (rate === undefined && newCode === undefined) {
      return res.status(400).json({
        msg: "Please provide at least one field to update: 'rate' or 'newCode'.",
      });
    }

    // Prepare the update object dynamically
    const updateData = {};
    if (rate !== undefined) updateData.rate = rate;
    if (newCode !== undefined) updateData.newCode = newCode;

    // Update the investigation with the specific fields
    const investigation = await OPDPackageModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true } // Return the updated document
    );

    if (!investigation) {
      return res.status(404).json({
        msg: "OPD Package not found.",
      });
    }

    return res.status(200).json({
      msg: "OPD Package updated successfully.",
      investigation,
    });
  } catch (error) {
    console.error("Error updating investigation:", error);
    res.status(500).json({
      err: "Server Error",
      error: error.message,
    });
  }
};

const deleteOPDPackages = async (req, res) => {
  try {
    const { id } = req.params;
    const package = await OPDPackageModel.findByIdAndUpdate(
      { _id: id },
      { delete: true, deletedAt: Date.now() },
      { new: true }
    );
    if (!package) {
      return res.status(400).json({ msg: "OPD Package  not found" });
    }
    await package.save();
    return res
      .status(httpStatus.OK)
      .json({ msg: "OPD Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ err: "Server Error", error });
  }
};

const deepSanitize = (services = []) => {
  return services.map((obj) => {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        // Convert "" to [] for specific array-type fields
        if (
          (key === "department" ||
            key === "departmentId" ||
            key === "patientEncounter") &&
          value === ""
        ) {
          return [key, []];
        }

        // Convert "" to null for other *_id fields
        if (
          key.toLowerCase().endsWith("id") &&
          key !== "departmentId" &&
          value === ""
        ) {
          return [key, null];
        }

        // General case: convert empty strings to null
        return [key, value === "" ? null : value];
      })
    );
  });
};

const bulkImport = async (req, res) => {
  try {
    const sanitizedServices = deepSanitize(req.body);

    const result = await OPDPackageModel.insertMany(sanitizedServices);
    res
      .status(httpStatus.CREATED)
      .json({ msg: "OPD Package Added Successfully", data: result });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

module.exports = {
  createOPDPackages,
  getAllOPDPackages,
  editOPDPackages,
  deleteOPDPackages,
  bulkImport,
  updateOpdPackageRateAndCode,
};
