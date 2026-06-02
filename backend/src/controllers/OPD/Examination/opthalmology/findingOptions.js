const FindingOption = require("../../../../models/OPD/Examination/opthalmology/findingOptions");

// CREATE
const createFindingOption = async (req, res) => {
  try {
    console.log(req.body);
    const { finding, category, eye } = req.body;

    if (!finding || !category || !eye) {
      return res.status(400).json({
        message: "Vision, category, and eye are required.",
      });
    }

    const newOption = new FindingOption({
      finding: finding.trim(),
      category,
      eye,
    });
    await newOption.save();

    res.status(201).json({
      message: "Finding option created.",
      data: newOption,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating finding option.",
      error,
    });
  }
};

// READ (ALL)
const getAllFindingOptions = async (req, res) => {
  try {
    const options = await FindingOption.find().sort({ createdAt: -1 });
    res.status(200).json({ data: options });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching finding options.",
      error,
    });
  }
};

// UPDATE
const updateFindingOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { finding } = req.body;

    const updated = await FindingOption.findByIdAndUpdate(
      id,
      { finding: finding.trim() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Finding option not found." });
    }

    res.status(200).json({
      message: "Finding option updated.",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating finding option.",
      error,
    });
  }
};

// DELETE
const deleteFindingOption = async (req, res) => {
  try {
    const { finding, category, eye } = req.body;
    const deleted = await FindingOption.findOneAndDelete({
      finding,
      category,
      eye,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Finding option not found." });
    }

    res.status(200).json({
      message: "Finding option deleted.",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting finding option.",
      error,
    });
  }
};

module.exports = {
  createFindingOption,
  getAllFindingOptions,
  updateFindingOption,
  deleteFindingOption,
};
