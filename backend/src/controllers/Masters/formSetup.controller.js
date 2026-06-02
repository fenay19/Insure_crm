const FormSetupModel = require('../../models/Masters/formSetup.model');

const createFormSetup = async (req, res) => {
  try {
    const { department, departmentId } = req.body;

    // Create a new entry with department and departmentId only
    const newFormSetup = new FormSetupModel({ department, departmentId });
    const savedFormSetup = await newFormSetup.save();

    res.status(201).json({
      success: true,
      message: "Form setup created successfully",
      data: savedFormSetup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating form setup",
      error: error.message,
    });
  }
};

// Update form setup with nested data
const updateFormSetup = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      complaints,
      medicalHistory,
      examinations,
      medicalPrescription,
      provisionalDiagnosis,
      finalDiagnosis,
      follow,
    } = req.body;

    // Find the document and update nested fields
    const updatedFormSetup = await FormSetupModel.findByIdAndUpdate(
      id,
      {
        complaints,
        medicalHistory,
        examinations,
        medicalPrescription,
        provisionalDiagnosis,
        finalDiagnosis,
        follow,
      },
      { new: true, runValidators: true }
    );

    if (!updatedFormSetup) {
      return res.status(404).json({
        success: false,
        message: "Form setup not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Form setup updated successfully",
      data: updatedFormSetup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating form setup",
      error: error.message,
    });
  }
};

const getAllFormSetups = async (req, res) => {
  try {
    const formSetups = await FormSetupModel.find().populate('departmentId');
    res.status(200).json({ data: formSetups });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching form setups', error: error.message });
  }
};

const getFormSetupById = async (req, res) => {
  try {
    const { id } = req.params;
    const formSetup = await FormSetupModel.findById(id).populate('departmentId');

    if (!formSetup) {
      return res.status(404).json({ message: 'Form setup not found' });
    }

    res.status(200).json({ data: formSetup });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching form setup', error: error.message });
  }
};

const deleteFormSetup = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFormSetup = await FormSetupModel.findByIdAndDelete(id);

    if (!deletedFormSetup) {
      return res.status(404).json({ message: 'Form setup not found' });
    }

    res.status(200).json({ message: 'Form setup deleted successfully', data: deletedFormSetup });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting form setup', error: error.message });
  }
};

module.exports = {
  createFormSetup,
  getAllFormSetups,
  getFormSetupById,
  updateFormSetup,
  deleteFormSetup,
};
