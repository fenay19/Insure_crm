const { default: mongoose } = require("mongoose");
const { financialYearModel } = require("../../../models/index");

const getFinancialYearController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const financialYears = await financialYearModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!financialYears || financialYears.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No Financial Year found" });
    }
    // sort data from newest to oldest
    financialYears.sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate));

    res.status(200).json({ status: "true", data: financialYears });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching Financial Year", error.message],
    });
  }
};

const postFinancialYearController = async (req, res) => {
  try {
    console.log("📥 Incoming request body:", req.body);

    const { fromDate, toDate } = req.body;

    const { companyId } = req.query;

    // 📝 Create new financialYear document
    const newfinancialYear = new financialYearModel({
      fromDate,
      toDate,
      companyId,
    });

    await newfinancialYear.save();

    return res.status(201).json({
      status: true,
      message: "financial Year registered successfully",
      data: newfinancialYear,
    });
  } catch (error) {
    console.error("🔥 Error in post financial Year:", error);
    return res.status(500).json({
      message: "Server error while registering client.",
      error: error.message,
    });
  }
};

const putFinancialYearController = async (req, res) => {
  try {
    const { id } = req.params;
    const { fromDate, toDate } = req.body;

    const updatedfinancialYear = await financialYearModel.findByIdAndUpdate(
      id,
      {
        fromDate,
        toDate,
      },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Financial Year updated successfully",
      data: updatedfinancialYear,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update Financial Year",
      error: error.message,
    });
  }
};

// delete License Validity
const deleteFinancialYearController = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedfinancialYear = await financialYearModel.findByIdAndDelete(id);

    if (!deletedfinancialYear) {
      return res.status(404).json({ message: "Financial Year not found" });
    }

    return res
      .status(200)
      .json({ status: "true", message: "Financial Year deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting Financial Year" });
  }
};

module.exports = {
  getFinancialYearController,
  postFinancialYearController,
  putFinancialYearController,
  deleteFinancialYearController,
};
