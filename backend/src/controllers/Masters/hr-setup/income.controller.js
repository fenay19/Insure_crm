const { default: mongoose } = require("mongoose");
const IncomeModel = require("../../../models/Masters/hr-setup/income.model");

const createIncome = async (req, res) => {
  console.log("Received payload:", req.body);
  try {
    const { income, amount } = req.body;
    const { companyId } = req.query;

    // Validate required fields
    if (!income) {
      return res.status(400).json({
        success: false,
        message: "Income field is required",
      });
    }

    if (amount === undefined || amount === null) {
      return res.status(400).json({
        success: false,
        message: "Amount field is required",
      });
    }

    // Validate if amount is a number and is greater than 0
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    // Create new income record
    const newIncome = new IncomeModel({
      income,
      amount,
      companyId,
    });

    console.log("New income entry:", newIncome);
    await newIncome.save();

    // Send success response with the created income data
    res.status(201).json({
      success: true,
      message: "Income created successfully",
      data: newIncome,
    });
  } catch (error) {
    console.error("Error creating Income:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message, // Send the error message to the client
    });
  }
};

const getIncome = async (req, res) => {
  try {
    const { companyId } = req.query;
    const incomes = await IncomeModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
      delete: false,
    }).sort({
      createdAt: -1,
    });
    // console.log("Fetched incomes:", incomes);

    res.status(200).json({
      success: true,
      message: "Income fetched successfully",
      data: incomes,
    });
  } catch (error) {
    console.error("Error fetching Income:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    console.log("Updating income ID:", id);
    console.log("Data to update:", updatedData);

    // Ensure that the income exists before updating
    const updatedIncome = await IncomeModel.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation runs for the update
    });

    if (!updatedIncome) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.status(200).json({
      success: true,
      message: "Income updated successfully",
      data: updatedIncome,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const deleteIncome = async (req, res) => {
  try {
    const incomeId = req.params.id;
    console.log(incomeId); // Log the id to confirm it's being passed
    console.log("Deleting income with ID:", incomeId);
    const result = await IncomeModel.findByIdAndDelete(incomeId);
    if (!result) {
      return res.status(404).json({ message: "Income record not found" });
    }
    return res
      .status(200)
      .json({ message: "Income record deleted successfully" });
  } catch (err) {
    console.error("Error deleting income:", err);
    return res.status(500).json({ message: "Error deleting income record" });
  }
};
module.exports = {
  createIncome,
  getIncome,
  updateIncome,
  deleteIncome,
};
