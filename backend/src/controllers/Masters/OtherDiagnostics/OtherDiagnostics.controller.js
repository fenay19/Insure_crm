const httpStatus = require("http-status");
const OtherDiagnosticsModel = require("../../../models/Masters/OtherDiagnostics/OtherDiagnosticsModel");

// ✅ Fetch all diagnostics (excluding deleted ones)
const fetchAllDiagnostics = async (req, res) => {
  try {
    const diagnostics = await OtherDiagnosticsModel.find({ delete: false });

    if (!diagnostics.length) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No diagnostics found." });
    }

    const formattedData = diagnostics.map((item) => ({
      ...item._doc,
      description: item._doc.description.length
        ? item._doc.description[0]
        : null,
    }));

    return res.status(httpStatus.OK).json({
      msg: "Diagnostics retrieved successfully",
      diagnostics: formattedData,
    });
  } catch (error) {
    console.error("Error fetching diagnostics:", error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error", error });
  }
};

// ✅ Add a new diagnostic entry
const createDiagnostic = async (req, res) => {
  try {
    const diagnosticData = req.body;

    if (!diagnosticData) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Diagnostic data is required." });
    }

    const newDiagnostic = new OtherDiagnosticsModel(diagnosticData);
    await newDiagnostic.save();

    return res.status(httpStatus.CREATED).json({
      msg: "Diagnostic added successfully",
      diagnostic: newDiagnostic,
    });
  } catch (error) {
    console.error("Error adding diagnostic:", error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error", error });
  }
};

// ✅ Update an existing diagnostic entry
const updateDiagnostic = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const diagnostic = await OtherDiagnosticsModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!diagnostic) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "Diagnostic not found." });
    }

    return res.status(httpStatus.OK).json({
      msg: "Diagnostic updated successfully",
      diagnostic,
    });
  } catch (error) {
    console.error("Error updating diagnostic:", error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error", error });
  }
};

// ✅ Update only Rate and Code for a diagnostic
const modifyDiagnosticRateAndCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { rate, newCode } = req.body;

    if (rate === undefined && newCode === undefined) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "Provide at least one field to update: 'rate' or 'newCode'.",
      });
    }

    const updateFields = {};
    if (rate !== undefined) updateFields.rate = rate;
    if (newCode !== undefined) updateFields.newCode = newCode;

    const diagnostic = await OtherDiagnosticsModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!diagnostic) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "Diagnostic not found." });
    }

    return res.status(httpStatus.OK).json({
      msg: "Diagnostic rate and/or code updated successfully.",
      diagnostic,
    });
  } catch (error) {
    console.error("Error modifying diagnostic rate/code:", error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error", error });
  }
};

// ✅ Soft delete a diagnostic entry
const removeDiagnostic = async (req, res) => {
  try {
    const { id } = req.params;

    const diagnostic = await OtherDiagnosticsModel.findByIdAndUpdate(
      id,
      { delete: true, deletedAt: Date.now() },
      { new: true }
    );

    if (!diagnostic) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "Diagnostic not found." });
    }

    return res.status(httpStatus.OK).json({
      msg: "Diagnostic deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting diagnostic:", error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server Error", error });
  }
};

const deepSanitize = (services = []) => {
  return services.map((obj) => {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        // Convert "" to [] for specific array-type fields
        if ((key === "department" || key === "departmentId") && value === "") {
          return [key, []];
        }

        // Convert "" to null for other *_id fields
        if (
          (key.toLowerCase().endsWith("id") || key === "testRange") &&
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

// ✅ Bulk import diagnostics
const bulkCreateDiagnostics = async (req, res) => {
  try {
    const santizedData = deepSanitize(req.body);

    const result = await OtherDiagnosticsModel.insertMany(santizedData);

    return res.status(httpStatus.CREATED).json({
      msg: "Diagnostics imported successfully.",
      diagnostics: result,
    });
  } catch (error) {
    console.error("Error during bulk import:", error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error", error });
  }
};

module.exports = {
  fetchAllDiagnostics,
  createDiagnostic,
  updateDiagnostic,
  removeDiagnostic,
  bulkCreateDiagnostics,
  modifyDiagnosticRateAndCode,
};
