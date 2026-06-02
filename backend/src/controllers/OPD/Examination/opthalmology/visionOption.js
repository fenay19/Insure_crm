const VisionOption = require("../../../../models/OPD/Examination/opthalmology/visionOptions");

// CREATE
const createVisionOption = async (req, res) => {
  try {
    const { vision, category, eye } = req.body;

    if (!vision || !category || !eye) {
      return res
        .status(400)
        .json({ message: "Vision, category, and eye are required." });
    }

    const newOption = new VisionOption({
      vision: vision.trim(),
      category,
      eye,
    });
    await newOption.save();

    res
      .status(201)
      .json({ message: "Vision option created.", data: newOption });
  } catch (error) {
    res.status(500).json({ message: "Error creating vision option.", error });
  }
};

// READ (ALL)
const getAllVisionOptions = async (req, res) => {
  try {
    const options = await VisionOption.find().sort({ createdAt: -1 });
    res.status(200).json({ data: options });
  } catch (error) {
    res.status(500).json({ message: "Error fetching vision options.", error });
  }
};

// UPDATE
const updateVisionOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { vision } = req.body;

    const updated = await VisionOption.findByIdAndUpdate(
      id,
      { vision: vision.trim() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Vision option not found." });
    }

    res.status(200).json({ message: "Vision option updated.", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating vision option.", error });
  }
};

// DELETE
const deleteVisionOption = async (req, res) => {
  try {
    const { vision, category, eye } = req.body;
    const deleted = await VisionOption.findOneAndDelete({
      vision,
      category,
      eye,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Vision option not found." });
    }

    res.status(200).json({ message: "Vision option deleted.", data: deleted });
  } catch (error) {
    res.status(500).json({ message: "Error deleting vision option.", error });
  }
};

module.exports = {
  createVisionOption,
  getAllVisionOptions,
  updateVisionOption,
  deleteVisionOption,
};
