const mongoose = require("mongoose");
const {
  VisionModel,
  FindingsModel,
  AutoRefractionModel,
  AutoRefractionModelDilated,
} = require("../../../models/OPD/patient_opthelmic.model");

const createVision = async (req, res) => {
  try {
    const visionData = new VisionModel(req.body);
    await visionData.save();
    res.status(201).json({ success: true, visionData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateVision = async (req, res) => {
  try {
    const { id } = req.params;
    const { vision } = req.body; // Get _id and new vision data from request body

    const updatedVision = await VisionModel.findOneAndUpdate(
      { _id: id }, // Find by _id
      { $push: { vision } }, // Push new data into vision array
      { new: true, upsert: false } // Return updated document
    );

    if (!updatedVision) {
      return res.status(404).json({ message: "Vision data not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createFindings = async (req, res) => {
  try {
    const findingsData = new FindingsModel(req.body);
    await findingsData.save();
    res.status(201).json({ success: true, findingsData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateFindings = async (req, res) => {
  try {
    const { id } = req.params;
    const { finding } = req.body; // Get _id and new vision data from request body

    const updateFinding = await FindingsModel.findOneAndUpdate(
      { _id: id }, // Find by _id
      { $push: { findings: finding } }, // Push new data into vision array
      { new: true, upsert: false } // Return updated document
    );

    if (!updateFinding) {
      return res.status(404).json({ message: "Finding data not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createAutoRefraction = async (req, res) => {
  try {
    const autoRefractionData = new AutoRefractionModel(req.body);
    await autoRefractionData.save();
    res.status(201).json({ success: true, autoRefractionData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateAutoRefraction = async (req, res) => {
  try {
    const { id } = req.params;
    const { autoRefraction } = req.body; // Get _id and new vision data from request body

    const updateAutoRef = await AutoRefractionModel.findOneAndUpdate(
      { _id: id }, // Find by _id
      { $push: { autoRefraction } }, // Push new data into vision array
      { new: true, upsert: false } // Return updated document
    );

    if (!updateAutoRef) {
      return res
        .status(404)
        .json({ message: "Auto Refraction data not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPatientOpthalmic = async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log("patient", patientId);
    if (!patientId) {
      return res.status(400).json({ error: "Patient ID is required" });
    }

    const results = await Promise.allSettled([
      VisionModel.find({ patientId }),
      FindingsModel.find({ patientId }),
      AutoRefractionModel.find({ patientId }),
    ]);

    const visionData =
      results[0].status === "fulfilled" ? results[0].value : null;
    const findingData =
      results[1].status === "fulfilled" ? results[1].value : null;
    const autoRefractionData =
      results[2].status === "fulfilled" ? results[2].value : null;

    return res.status(200).json({
      data: {
        visionData,
        findingData,
        autoRefractionData,
      },
      errors: results
        .filter((r) => r.status === "rejected")
        .map((r) => r.reason.message),
    });
  } catch (error) {
    console.error("Error fetching ophthalmic data:", error);
    res.status(500).json({ error: error.message });
  }
};

const deletePatientOpthalmic = async (req, res) => {
  try {
    const { patientId, type, id } = req.params;

    if (!patientId || !type || !id) {
      return res
        .status(400)
        .json({ error: "Patient ID, type, and record ID are required" });
    }

    // Map type to the correct model and array key
    const modelMap = {
      vision: { model: VisionModel, key: "vision" },
      finding: { model: FindingsModel, key: "findings" },
      autoRefraction: { model: AutoRefractionModel, key: "autoRefraction" },
    };

    const selectedModel = modelMap[type];

    if (!selectedModel) {
      return res.status(400).json({ error: "Invalid type parameter" });
    }

    const { model, key } = selectedModel;

    // Find the document and remove the item from the nested array
    const updatedRecord = await model.findOneAndUpdate(
      { patientId },
      { $pull: { [key]: { _id: id } } }, // Pull the item with the matching `_id`
      { new: true } // Return the updated document
    );

    if (!updatedRecord) {
      return res
        .status(404)
        .json({ error: "Record not found or already deleted" });
    }

    res.status(200).json({
      success: true,
      message: `${type} record deleted successfully`,
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error deleting ophthalmic data:", error);
    res.status(500).json({ error: error.message });
  }
};

const updatePatientOpthalmicInner = async (req, res) => {
  try {
    const { patientId, type, id } = req.params; 
    const updateData = req.body; 

    if (!patientId || !type || !id) {
      return res
        .status(400)
        .json({ error: "Patient ID, type, and record ID are required" });
    }

    // Map type to the correct model and array key
    const modelMap = {
      vision: { model: VisionModel, key: "vision" },
      finding: { model: FindingsModel, key: "findings" },
      autoRefraction: { model: AutoRefractionModel, key: "autoRefraction" },
    };

    const selectedModel = modelMap[type];

    if (!selectedModel) {
      return res.status(400).json({ error: "Invalid type parameter" });
    }

    const { model, key } = selectedModel;

    // Update the specific object inside the array
    const updatedRecord = await model.findOneAndUpdate(
      { patientId, [`${key}._id`]: id }, // Find the document containing the nested object
      { $set: { [`${key}.$`]: { _id: id, ...updateData } } }, // Update the matched object inside the array
      { new: true } // Return the updated document
    );

    if (!updatedRecord) {
      return res
        .status(404)
        .json({ error: "Record not found or update failed" });
    }

    res.status(200).json({
      success: true,
      message: `${type} record updated successfully`,
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error updating ophthalmic data:", error);
    res.status(500).json({ error: error.message });
  }
};

const createAutoRefractionDilated = async (req, res) => {
  try {
    const autoRefractionData = new AutoRefractionModelDilated(req.body);
    await autoRefractionData.save();
    res.status(201).json({ success: true, autoRefractionData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateAutoRefractionDilated = async (req, res) => {
  try {
    const { id } = req.params;
    const { autoRefraction } = req.body; // Get _id and new vision data from request body

    const updateAutoRef = await AutoRefractionModelDilated.findOneAndUpdate(
      { _id: id }, // Find by _id
      { $push: { autoRefraction } }, // Push new data into vision array
      { new: true, upsert: false } // Return updated document
    );

    if (!updateAutoRef) {
      return res
        .status(404)
        .json({ message: "Auto Refraction data not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  updateAutoRefractionDilated,
  createAutoRefractionDilated,
  createVision,
  updateVision,
  createFindings,
  updateFindings,
  createAutoRefraction,
  updateAutoRefraction,
  getPatientOpthalmic,
  deletePatientOpthalmic,
  updatePatientOpthalmicInner,
};
