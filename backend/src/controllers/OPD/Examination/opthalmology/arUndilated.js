const ArUndilatedModel = require("../../../../models/OPD/Examination/opthalmology/arUndilated");

// CREATE
const createArUndilatedOption = async (req, res) => {
  try {
    console.log(req.body);
    const { name, category, eye } = req.body;

    if (!name || !category || !eye) {
      return res.status(400).json({
        message: "Finding, category, and eye are required.",
      });
    }

    const newOption = new ArUndilatedModel({
      name: name.trim(),
      category,
      eye,
    });
    await newOption.save();

    res.status(201).json({
      message: "AR Undilated option created.",
      data: newOption,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating AR Undilated option.",
      error,
    });
  }
};

// READ (ALL)
const getAllArUndilatedOptions = async (req, res) => {
  try {
    const options = await ArUndilatedModel.find().sort({ createdAt: -1 });
    res.status(200).json({ data: options });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching AR Undilated options.",
      error,
    });
  }
};

// UPDATE
const updateArUndilatedOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updated = await ArUndilatedModel.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "AR Undilated option not found." });
    }

    res.status(200).json({
      message: "AR Undilated option updated.",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating AR Undilated option.",
      error,
    });
  }
};

// DELETE
const deleteArUndilatedOption = async (req, res) => {
  try {
    const { name, category, eye } = req.body;
    const deleted = await ArUndilatedModel.findOneAndDelete({
      name,
      category,
      eye,
    });

    if (!deleted) {
      return res.status(404).json({ message: "AR Undilated option not found." });
    }

    res.status(200).json({
      message: "AR Undilated option deleted.",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting AR Undilated option.",
      error,
    });
  }
};

module.exports = {
  createArUndilatedOption,
  getAllArUndilatedOptions,
  updateArUndilatedOption,
  deleteArUndilatedOption,
};
