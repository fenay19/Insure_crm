const httpStatus = require("http-status");
const GipsaaCompanyMasterModel = require("../../models/Masters/gipsaa_master.model");

// Add gipsa company
const addGipsaaCompany = async (req, res) => {
  try {
    const { gipsaaCompanyName } = req.body;

    if (!gipsaaCompanyName) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Fields are required" });
    }
    const exsistingCompany = await GipsaaCompanyMasterModel.findOne({
      gipsaaCompanyName,
      delete: false,
    });

    if (exsistingCompany) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "The TPA Company is already exists!!" });
    }
    const newCompany = new GipsaaCompanyMasterModel({ gipsaaCompanyName });
    await newCompany.save();
    res.status(httpStatus.CREATED).json({
      msg: "The GIPSAA Company created successfully",
      data: newCompany,
    });
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in creating a Gipsaa Company", err });
  }
};

// Get Gipsaa Compnay
const getGipsaaCompany = async (req, res) => {
  try {
    const allGipsaaCompany = await GipsaaCompanyMasterModel.find({
      delete: false,
    });
    if (!allGipsaaCompany) {
      res.status(httpStatus.NOT_FOUND).json({ msg: "No gipsaa Company found" });
    }
    res
      .status(httpStatus.OK)
      .json({ msg: "Gipsaa Company found successfully", allGipsaaCompany });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in fetching all the gipsaa Company" }, err);
  }
};

// Update Gipsaa compnay
const updateGipsaaCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { gipsaaCompanyName } = req.body;
    const existingCompany = await GipsaaCompanyMasterModel.findOne({
      gipsaaCompanyName,
      delete: false,
    });

    if (existingCompany && existingCompany._id.toString() !== id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "The Gipsaa Company is already exists!!" });
    }

    const newCompany = await GipsaaCompanyMasterModel.findByIdAndUpdate(
      { _id: id },
      { $set: { ...req.body } },
      { new: true }
    );
    res.status(httpStatus.OK).json({
      message: "Gipsaa Company updated successfully",
      data: newCompany,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in updating the Gipsaa Company", error });
  }
};

// Delete Gipsaa compnay
const deleteGipsaaCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await GipsaaCompanyMasterModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now(), new: true }
    );

    if (!company) {
      res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "No Gipsaa Company found!!" });
    }
    res
      .status(httpStatus.OK)
      .json({ message: "Gipsaa Company deleted successfully!!" });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: "Error in deleting gipsaa Company!!" });
  }
};

// Import Data
const bulkGipsaaCompanyImport = async (req, res) => {
  try {
    const gipsaaCompany = req.body;
    const result = await GipsaaCompanyMasterModel.insertMany(gipsaaCompany);
    res
      .status(httpStatus.CREATED)
      .json({ msg: "Gipsaa Company Imported", data: result });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

module.exports = {
  addGipsaaCompany,
  deleteGipsaaCompany,
  updateGipsaaCompany,
  getGipsaaCompany,
  bulkGipsaaCompanyImport
};
