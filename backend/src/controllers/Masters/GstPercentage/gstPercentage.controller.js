const { default: mongoose } = require("mongoose");
const { GstPercentageModel } = require("../../../models/index");

// Create GST
const createGst = async (req, res) => {
  try {
    console.log("reached controller");
    console.log("req bodu, ", req.body);
    const { companyId } = req.query;
    const { value } = req.body;
    // const { cgst } = req.body;
    // const { sgst } = req.body;
    // const { ugst } = req.body;
    // const { igst } = req.body;
    const { effectiveFrom } = req.body;
    const gst = await GstPercentageModel.create({
      value,
      // cgst,
      // sgst,
      // ugst,
      // igst,
      effectiveFrom,
      companyId,
    });
    res.status(201).json({
      message: "GST Percentage created successfully",
      data: gst,
    });
  } catch (err) {
    console.error("Error creating GST Percentage:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all GSTs
const getAllGsts = async (req, res) => {
  try {
    const { companyId } = req.query;
    const gsts = await GstPercentageModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false,
    }).sort({ value: 1 }); // 1 = ascending;
    if (!gsts || gsts.length === 0) {
      return res.status(404).json({ message: "No GST Percentages found" });
    }
    // Sort by createdAt in descending order
    // gsts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({
      message: "GST Percentages retrieved successfully",
      data: gsts,
    });
  } catch (err) {
    console.error("Error retrieving GST Percentages:", err);
    res.status(500).json({ message: err.message });
  }
};

// get GST by ID
const getGstById = async (req, res) => {
  try {
    const { id } = req.params;
    const gst = await GstPercentageModel.findById(id).where({
      isDeleted: false,
    });
    if (!gst || gst.isDeleted)
      return res.status(404).json({ message: "GST not found" });
    res.status(200).json({
      message: "GST Percentage retrieved successfully",
      data: gst,
    });
  } catch (err) {
    console.error("Error retrieving GST Percentage:", err);
    res.status(500).json({ message: err.message });
  }
};

// update GST by ID
const updateGst = async (req, res) => {
  try {
    const { value } = req.body;
    // const { cgst } = req.body;
    // const { sgst } = req.body;
    // const { ugst } = req.body;
    // const { igst } = req.body;
    const { effectiveFrom } = req.body;
    const gst = await GstPercentageModel.findByIdAndUpdate(
      req.params.id,
      { value, effectiveFrom },
      { new: true },
    );
    if (!gst || gst.isDeleted)
      return res.status(404).json({ message: "GST not found" });
    res.status(200).json({
      message: "GST Percentage updated successfully",
      data: gst,
    });
  } catch (err) {
    console.error("Error updating GST Percentage:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete GST (Soft delete)
const deleteGst = async (req, res) => {
  try {
    const gst = await GstPercentageModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true },
    );
    if (!gst) return res.status(404).json({ message: "GST not found" });
    res.status(200).json({ message: "GST deleted successfully" });
  } catch (err) {
    console.error("Error deleting GST Percentage:", err);
    res.status(500).json({ message: err.message });
  }
};

// Export the controller functions
module.exports = {
  createGst,
  getAllGsts,
  getGstById,
  updateGst,
  deleteGst,
};
