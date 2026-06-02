const { default: mongoose } = require("mongoose");
const { insCompanyModel } = require("../../../models/index");

const getInsCompanyController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const insCompanys = await insCompanyModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!insCompanys || insCompanys.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No Insurance Company found" });
    }
    // sort data from newest to oldest
    insCompanys.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ status: "true", data: insCompanys });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching company", error.message],
    });
  }
};

const postInsCompanyController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const insCompany = req.body.insCompany;
    if (!insCompany) {
      return res
        .status(400)
        .json({ status: "false", message: " Insurance Company is required" });
    }

    const newInsCompany = new insCompanyModel({ insCompany, companyId });
    await newInsCompany.save();
    res.status(201).json({ status: "true", data: newInsCompany });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating  Insurance Company", error.message],
    });
  }
};

const putInsCompanyController = async (req, res) => {
  try {
    const id = req.params.id;
    const { insCompany } = req.body;

    const updatedCompany = await insCompanyModel.findByIdAndUpdate(
      id,
      { insCompany },
      { new: true, runValidators: true }
    );

    if (!updatedCompany) {
      return res
        .status(404)
        .json({ status: "false", message: "Company not found" });
    }

    res.status(200).json({ status: "true", data: updatedCompany });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error Updating Company", error.message],
    });
  }
};

const deleteInsCompanyController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedCompany = await insCompanyModel.findByIdAndDelete(id);

    if (!deletedCompany) {
      return res
        .status(404)
        .json({ status: "false", message: "Company not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "Company deleted Successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting Company", error.message],
    });
  }
};

module.exports = {
  getInsCompanyController,
  postInsCompanyController,
  putInsCompanyController,
  deleteInsCompanyController,
};
