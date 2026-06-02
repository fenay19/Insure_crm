const DilatedModel = require("../../../../models/OPD/Examination/opthalmology/arDilated");

// CREATE
const createDilatedOption = async (req, res) => {
  try {
    console.log(req.body);
    const { name, category, eye } = req.body;

    if (!name || !category || !eye) {
      return res.status(400).json({
        message: "Dilated, category, and eye are required.",
      });
    }

    const newOption = new DilatedModel({
      name: name.trim(),
      category,
      eye,
    });
    await newOption.save();

    res.status(201).json({
      message: "Dilated option created.",
      data: newOption,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating Dilated option.",
      error,
    });
  }
};

// READ (ALL)
const getAllDilatedOptions = async (req, res) => {
  try {
    const options = await DilatedModel.find().sort({ createdAt: -1 });
    res.status(200).json({ data: options });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Dilated options.",
      error,
    });
  }
};

// UPDATE
const updateDilatedOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updated = await DilatedModel.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Dilated option not found." });
    }

    res.status(200).json({
      message: "Dilated option updated.",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating Dilated option.",
      error,
    });
  }
};

// DELETE
const deleteDilatedOption = async (req, res) => {
  try {
    const { name, category, eye } = req.body;
    const deleted = await DilatedModel.findOneAndDelete({
      name,
      category,
      eye,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Dilated option not found." });
    }

    res.status(200).json({
      message: "Dilated option deleted.",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting Dilated option.",
      error,
    });
  }
};

module.exports = {
  createDilatedOption,
  getAllDilatedOptions,
  updateDilatedOption,
  deleteDilatedOption,
};
