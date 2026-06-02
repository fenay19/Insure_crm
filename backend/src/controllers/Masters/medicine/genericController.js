const GenericModel = require("../../../models/Masters/medicine/generic.model");
// Create Generic
exports.createGeneric = async (req, res) => {
  try {
    const { genericName } = req.body;
    const newGeneric = new GenericModel({ genericName });
    const savedGeneric = await newGeneric.save();
    res.status(201).json({ success: true, data: savedGeneric });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Generics (excluding deleted ones)
exports.getAllGenerics = async (req, res) => {
  try {
    const generics = await GenericModel.find({ delete: false });
    res.status(200).json({ success: true, data: generics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Generic
exports.updateGeneric = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGeneric = await GenericModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedGeneric });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Soft Delete Generic
exports.deleteGeneric = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`deleting ${id}`);
    await GenericModel.findByIdAndUpdate(
      id,
      { delete: true, deletedAt: new Date() },
      { new: true }
    );
    res.status(200).json({ success: true, msg: "generic Deleted" });
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
    await GenericModel.insertMany(req.body);

    return res
      .status(201)
      .json({ message: "Data imported successfully", data: newData });
  } catch (error) {
    console.error("Error importing data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
