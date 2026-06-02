const DoseModel = require("../../../models/Masters/medicine/dose.model");

const createDose = async (req, res) => {
  try {
    const { dose } = req.body;
    const newDose = new DoseModel({ dose });
    const savedDose = await newDose.save();
    res.status(201).json({ success: true, data: savedDose });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateDose = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDose = await DoseModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({ success: true, data: updatedDose });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllDose = async (req, res) => {
  try {
    const dose = await DoseModel.find({ delete: false });
    res.status(200).json({ success: true, data: dose });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDose = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteDose = await DoseModel.findByIdAndUpdate(
      id,
      { delete: true },
      { new: true }
    );

    return res.status(200).json({ success: true, data: deleteDose });
  } catch (error) {
    res.status(200).json({ success: false, message: error.message });
  }
};

const bulkImport = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: "Invalid or empty data provided" });
    }

    // Insert data into MongoDB
    await DoseModel.insertMany(req.body);

    return res
      .status(201)
      .json({ message: "Data imported successfully", data: newData });
  } catch (error) {
    console.error("Error importing data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createDose,
  updateDose,
  getAllDose,
  deleteDose,
  bulkImport,
};
