const TypeModel = require("../../../models/Masters/medicine/Type.model");

// Create Type
exports.createType = async (req, res) => {
  try {
    const { typeName } = req.body;
    const newType = new TypeModel({ typeName });
    const savedType = await newType.save();
    res.status(201).json({ success: true, data: savedType });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Types (excluding deleted ones)
exports.getAllTypes = async (req, res) => {
  try {
    const types = await TypeModel.find({ delete: false });
    res.status(200).json({ success: true, data: types });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Type
exports.updateType = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedType = await TypeModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedType });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Soft Delete Type
exports.deleteType = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedType = await TypeModel.findByIdAndUpdate(
      id,
      { delete: true, deletedAt: new Date() },
      { new: true }
    );
    res.status(200).json({ success: true, data: deletedType });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkImport = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: "Invalid or empty data provided" });
    }

    // Insert data into MongoDB
    await TypeModel.insertMany(req.body);

    return res
      .status(201)
      .json({ message: "Data imported successfully", data: newData });
  } catch (error) {
    console.error("Error importing data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
