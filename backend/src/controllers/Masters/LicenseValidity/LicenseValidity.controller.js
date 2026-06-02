const { default: mongoose } = require("mongoose");
const { licenseValidityModel } = require("../../../models/index");

const getLicenseValidityController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const licenseValiditys = await licenseValidityModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!licenseValiditys || licenseValiditys.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No License found" });
    }
    // sort data from newest to oldest
    licenseValiditys.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({ status: "true", data: licenseValiditys });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching license Validity", error.message],
    });
  }
};

const postLicenseValidityController = async (req, res) => {
  try {
    console.log("📥 Incoming request body:", req.body);

    const {
      licenseName,
      brokerName,
      licenseNumber,
      startDate,
      endDate,
      description,
      createdBy,
    } = req.body;

    const { companyId } = req.query;

    // 📝 Create new licenseValidity document
    const newLicenseValidity = new licenseValidityModel({
      licenseName,
      brokerName,
      licenseNumber,
      startDate,
      endDate,
      description,
      createdBy,
      companyId,
    });

    await newLicenseValidity.save();

    return res.status(201).json({
      status: true,
      message: "License validity registered successfully",
      data: newLicenseValidity,
    });
  } catch (error) {
    console.error("🔥 Error in post License Validity:", error);
    return res.status(500).json({
      message: "Server error while registering client.",
      error: error.message,
    });
  }
};

const updateLicenseValidityController = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      licenseName,
      brokerName,
      licenseNumber,
      startDate,
      endDate,
      description,
      createdBy,
    } = req.body;

    const updatedLicenseValidity = await licenseValidityModel.findByIdAndUpdate(
      id,
      {
        licenseName,
        brokerName,
        licenseNumber,
        startDate,
        endDate,
        description,
        createdBy,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "License Validity updated successfully",
      data: updatedLicenseValidity,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update License Validity",
      error: error.message,
    });
  }
};

// delete License Validity
const deleteLicenseValidityController = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedlicenseValidity = await licenseValidityModel.findByIdAndDelete(
      id
    );

    if (!deletedlicenseValidity) {
      return res.status(404).json({ message: "Lincense validity not found" });
    }

    return res
      .status(200)
      .json({ status: "true", message: "Lincense validity deleted" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error deleting Lincense validity" });
  }
};

module.exports = {
  getLicenseValidityController,
  postLicenseValidityController,
  updateLicenseValidityController,
  deleteLicenseValidityController,
};
