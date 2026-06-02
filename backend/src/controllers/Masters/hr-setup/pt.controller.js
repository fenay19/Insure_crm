const { default: mongoose } = require("mongoose");
const PTModel = require("../../../models/Masters/hr-setup/pt.model");

const createPT = async (req, res) => {
  try {
    const { companyId } = req.query;
    console.log(req.body); // Log the incoming request
    const { month, amount } = req.body;
    if (!month || !amount) {
      return res.status(400).json({ message: "Month and amount are required" });
    }
    const newPT = new PTModel({ month, amount, companyId });
    await newPT.save();
    return res.status(201).json(newPT);
  } catch (err) {
    console.error("Error in createPT:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
const getPT = async (req, res) => {
  try {
    const { companyId } = req.query;
    const ptData = await PTModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    res.status(200).json({ success: true, data: ptData });
  } catch (error) {
    console.error("Error fetching PT data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching PT data. Please try again later.",
    });
  }
};
const updatePT = async (req, res) => {
  try {
    const { id } = req.params;
    const { month, amount } = req.body;

    if (!id || id === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Valid ID is required",
      });
    }
    if (month === undefined || month === "") {
      return res
        .status(400)
        .json({ success: false, message: "month is required" });
    }

    if (amount === undefined || amount === "") {
      return res
        .status(400)
        .json({ success: false, message: "amount is required" });
    }
    const updatedPT = await PTModel.findByIdAndUpdate(
      id,
      { month, amount },
      { new: true, runValidators: true }
    );

    if (!updatedPT) {
      return res.status(404).json({ success: false, message: "PT not found" });
    }
    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: updatedPT,
    });
  } catch (error) {
    console.error("Error updating PT:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const deletePT = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }
    const deletedPT = await PTModel.findByIdAndDelete(id);
    if (!deletedPT) {
      return res.status(404).json({
        success: false,
        message: "PT not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "PT deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting PT:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
module.exports = {
  createPT,
  getPT,
  updatePT,
  deletePT,
};
