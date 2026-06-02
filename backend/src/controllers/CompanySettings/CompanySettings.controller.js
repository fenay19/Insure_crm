const {
  companySettingsModel,
  ClientRegistrationModel,
} = require("../../models/index");

const getCompanySettingsController = async (req, res) => {
  try {
    const companySettings = await companySettingsModel.find();
    res.status(200).json({ status: "true", data: companySettings });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching company settings", error.message],
    });
  }
};
const getCompanySettingsByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("company setting id is", id);
    const companySettings = await companySettingsModel.findById(id);
    console.log("company setting is", companySettings);
    if (!companySettings) {
      return res
        .status(404)
        .json({ status: "false", message: "Company settings not found" });
    }
    res.status(200).json({ status: "true", data: companySettings });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching company settings by ID", error.message],
    });
  }
};

const postCompanySettingsController = async (req, res) => {
  try {
    console.log(req.body);
    const newCompany = new companySettingsModel(req.body);
    const savedCompany = await newCompany.save();
    res.status(201).json({ status: "true", data: savedCompany });
  } catch (error) {
    res.status(400).json({
      status: "false",
      message: "Error saving company settings",
      error,
    });
  }
};
const putCompanySettingsController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCompany = await companySettingsModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedCompany) {
      return res
        .status(404)
        .json({ status: "false", message: "Company not found" });
    }
    res.status(200).json({ status: "true", data: updatedCompany });
  } catch (error) {
    res.status(400).json({
      status: "false",
      message: ["Error updating company settings", error.message],
    });
  }
};
const deleteCompanySettingsController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCompany = await companySettingsModel.findByIdAndDelete(id);
    if (!deletedCompany) {
      return res
        .status(404)
        .json({ status: "false", message: "Company not found" });
    }
    res
      .status(200)
      .json({ status: "true", message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting company settings", error.message],
    });
  }
};

const getCompanyLogoController = async (req, res) => {
  try {
    const { id } = req.params;

    const companySettings = await ClientRegistrationModel.findById(id);

    if (!companySettings || !companySettings.logo) {
      return res
        .status(404)
        .json({ status: "false", message: "Company logo not found" });
    }

    res.status(200).json({ status: "true", logo: companySettings.logo });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching company logo", error.message],
    });
  }
};

module.exports = {
  getCompanySettingsController,
  getCompanySettingsByIdController,
  postCompanySettingsController,
  putCompanySettingsController,
  deleteCompanySettingsController,
  getCompanyLogoController,
};
