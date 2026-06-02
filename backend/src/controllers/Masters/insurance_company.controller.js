const {
  TPACompanyMasterModel,
  InsuranceCompanyMasterModel,
  GovCompanyMasterModel,
  CoOperateCompanyMasterModel,
} = require("../../models");
const CoOperateCompanyMasterPrivateModel = require("../../models/Masters/co-operate_company_master_private");
const httpStatus = require("http-status");

// TPA Company
const addTpaCompany = async (req, res) => {
  try {
    const { tpaCompanyName } = req.body;

    const exsistingCompany = await TPACompanyMasterModel.findOne({
      tpaCompanyName,
      delete: false,
    });
    if (exsistingCompany) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "The TPA Company is already exists!!" });
    }
    const newCompany = new TPACompanyMasterModel(req.body);
    await newCompany.save();
    res
      .status(httpStatus.CREATED)
      .json({ msg: "The TPA Company created successfully", data: newCompany });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in creating a TPA Company", error });
  }
};

const getTpaCompany = async (req, res) => {
  try {
    const allTpaCompany = await TPACompanyMasterModel.find({ delete: false });
    if (!allTpaCompany) {
      res.status(httpStatus.NOT_FOUND).json({ msg: "No TPA Company found" });
    }
    res
      .status(httpStatus.OK)
      .json({ msg: "TPA Company found successfully", allTpaCompany });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in fetching all the TPA Company" }, err);
  }
};

const updateTpaCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { tpaCompanyName } = req.body;
    const deletes = false;
    const existingCompany = await TPACompanyMasterModel.findOne({
      tpaCompanyName: tpaCompanyName,
      delete: deletes,
    });

    if (existingCompany && existingCompany._id.toString() !== id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "The TPA Company is already exists!!" });
    }

    const newCompany = await TPACompanyMasterModel.findByIdAndUpdate(
      { _id: id },
      { $set: { ...req.body } },
      { new: true }
    );
    res
      .status(httpStatus.OK)
      .json({ message: "TPA Company updated successfully", data: newCompany });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in updating the TPA Company", error });
  }
};

const deleteTpaCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await TPACompanyMasterModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now(), new: true }
    );

    if (!company) {
      res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "No TPA Company found!!" });
    }
    res
      .status(httpStatus.OK)
      .json({ message: "TPA Company deleted successfully!!" });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: "Error in deleting TPA Company!!" });
  }
};

const bulkTpaCompanyImport = async (req, res) => {
  try {
    const tpaCompanyData = req.body;
    const result = await TPACompanyMasterModel.insertMany(tpaCompanyData);
    res
      .status(httpStatus.CREATED)
      .json({ msg: "TPA Company Imported", data: result });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

// Insurance Company
const addInsuranceCompany = async (req, res) => {
  try {
    const { insuranceCompanyName } = req.body;

    const exsistingCompany = await InsuranceCompanyMasterModel.findOne({
      insuranceCompanyName,
      delete: false,
    });
    if (exsistingCompany) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "The Insurance Company is already exists!!" });
    }
    const newCompany = new InsuranceCompanyMasterModel(req.body);
    await newCompany.save();
    res.status(httpStatus.CREATED).json({
      msg: "The Insurance Company created successfully",
      data: newCompany,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in creating a Insurance Company", error });
  }
};

const getInsuranceCompany = async (req, res) => {
  try {
    const allInsuranceCompany = await InsuranceCompanyMasterModel.find({
      delete: false,
    });
    if (!allInsuranceCompany) {
      res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Insurance Company found" });
    }
    res.status(httpStatus.OK).json({
      msg: "Insurance Company found successfully",
      allInsuranceCompany,
    });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in fetching all the Insurance Company" }, err);
  }
};

const updateInsuranceCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { insuranceCompanyName } = req.body;
    const deletes = false;
    const existingCompany = await InsuranceCompanyMasterModel.findOne({
      insuranceCompanyName: insuranceCompanyName,
      delete: deletes,
    });

    if (existingCompany && existingCompany._id.toString() !== id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "The Insurance Company is already exists!!" });
    }

    const newCompany = await InsuranceCompanyMasterModel.findByIdAndUpdate(
      { _id: id },
      { $set: { ...req.body } },
      { new: true }
    );
    res.status(httpStatus.OK).json({
      message: "Insurance Company updated successfully",
      data: newCompany,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in updating the Insurance Company", error });
  }
};

const deleteInsuranceCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await InsuranceCompanyMasterModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now(), new: true }
    );

    if (!company) {
      res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "No Insurance Company found!!" });
    }
    res
      .status(httpStatus.OK)
      .json({ message: "Insurance Company deleted successfully!!" });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: "Error in deleting Insurance Company!!" });
  }
};

const bulkInsuranceCompanyImport = async (req, res) => {
  try {
    const InsuranceCompanyData = req.body;
    const result = await InsuranceCompanyMasterModel.insertMany(
      InsuranceCompanyData
    );
    res
      .status(httpStatus.CREATED)
      .json({ msg: "Insurance Company Imported", data: result });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

// Goverment Company
const addGovermentCompany = async (req, res) => {
  try {
    const { govermentCompanyName } = req.body;

    const exsistingCompany = await GovCompanyMasterModel.findOne({
      govermentCompanyName,
      delete: false,
    });
    if (exsistingCompany) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "The Goverment Company is already exists!!" });
    }
    const newCompany = new GovCompanyMasterModel(req.body);
    await newCompany.save();
    res.status(httpStatus.CREATED).json({
      msg: "The Goverment Company created successfully",
      data: newCompany,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in creating a Goverment Company", error });
  }
};

const getGovermentCompany = async (req, res) => {
  try {
    const allGovermentCompany = await GovCompanyMasterModel.find({
      delete: false,
    });
    if (!allGovermentCompany) {
      res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Goverment Company found" });
    }
    res.status(httpStatus.OK).json({
      msg: "Goverment Company found successfully",
      allGovermentCompany,
    });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in fetching all the Goverment Company" }, err);
  }
};

const updateGovermentCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { govermentCompanyName } = req.body;
    const deletes = false;
    const existingCompany = await GovCompanyMasterModel.findOne({
      govermentCompanyName: govermentCompanyName,
      delete: deletes,
    });

    if (existingCompany && existingCompany._id.toString() !== id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "The Goverment Company is already exists!!" });
    }

    const newCompany = await GovCompanyMasterModel.findByIdAndUpdate(
      { _id: id },
      { $set: { ...req.body } },
      { new: true }
    );
    res.status(httpStatus.OK).json({
      message: "Goverment Company updated successfully",
      data: newCompany,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in updating the Goverment Company", error });
  }
};

const deleteGovermentCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await GovCompanyMasterModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now(), new: true }
    );

    if (!company) {
      res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "No Goverment Company found!!" });
    }
    res
      .status(httpStatus.OK)
      .json({ message: "Goverment Company deleted successfully!!" });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: "Error in deleting Goverment Company!!" });
  }
};

const bulkGovermentCompanyImport = async (req, res) => {
  try {
    const GovermentCompanyData = req.body;
    const result = await GovCompanyMasterModel.insertMany(GovermentCompanyData);
    res
      .status(httpStatus.CREATED)
      .json({ msg: "Goverment Company Imported", data: result });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

// Co-operative Company Public
const addCooperativeCompany = async (req, res) => {
  try {
    const { cooperativeCompanyName } = req.body;

    const exsistingCompany = await CoOperateCompanyMasterModel.findOne({
      cooperativeCompanyName,
      delete: false,
    });
    if (exsistingCompany) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "The Co-Operative Company is already exists!!" });
    }
    const newCompany = new CoOperateCompanyMasterModel(req.body);
    await newCompany.save();
    res.status(httpStatus.CREATED).json({
      msg: "The Co-Operative Company created successfully",
      data: newCompany,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in creating a Co-Operative Company", error });
  }
};

const getCooperativeCompany = async (req, res) => {
  try {
    const allCooperativeCompany = await CoOperateCompanyMasterModel.find({
      delete: false,
    });
    if (!allCooperativeCompany) {
      res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Co-Operative Company found" });
    }
    res.status(httpStatus.OK).json({
      msg: "Co-Operative Company found successfully",
      allCooperativeCompany,
    });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in fetching all the Co-Operative Company" }, err);
  }
};

const updateCooperativeCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { cooperativeCompanyName } = req.body;
    const deletes = false;
    const existingCompany = await CoOperateCompanyMasterModel.findOne({
      cooperativeCompanyName: cooperativeCompanyName,
      delete: deletes,
    });

    if (existingCompany && existingCompany._id.toString() !== id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "The Co-Operative Company is already exists!!" });
    }

    const newCompany = await CoOperateCompanyMasterModel.findByIdAndUpdate(
      { _id: id },
      { $set: { ...req.body } },
      { new: true }
    );
    res.status(httpStatus.OK).json({
      message: "Co-Operative Company updated successfully",
      data: newCompany,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in updating the Co-Operative Company", error });
  }
};

const deleteCooperativeCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await CoOperateCompanyMasterModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now(), new: true }
    );

    if (!company) {
      res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "No Co-Operative Company found!!" });
    }
    res
      .status(httpStatus.OK)
      .json({ message: "Co-Operative Company deleted successfully!!" });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: "Error in deleting Co-Operative Company!!" });
  }
};

const bulkCooperativeCompanyImport = async (req, res) => {
  try {
    const CooperativeCompanyData = req.body;
    const result = await CoOperateCompanyMasterModel.insertMany(
      CooperativeCompanyData
    );
    res
      .status(httpStatus.CREATED)
      .json({ msg: "Co-Operative Company Imported", data: result });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

// Cooperate Company Private
const addCooperativeCompanyPrivate = async (req, res) => {
  try {
    const { cooperativeCompanyName } = req.body;
    console.log("Co",cooperativeCompanyName)

    const exsistingCompany = await CoOperateCompanyMasterPrivateModel.findOne({
      cooperativeCompanyName,
      delete: false,
    });
    if (exsistingCompany) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "The Co-Operative Private Company is already exists!!" });
    }
    const newCompany = new CoOperateCompanyMasterPrivateModel(req.body);
    await newCompany.save();
    res.status(httpStatus.CREATED).json({
      msg: "The Co-Operative Private  Company created successfully",
      data: newCompany,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in creating a Co-Operative Company", error });
  }
};

const getCooperativeCompanyPrivate = async (req, res) => {
  try {
    const allCooperativeCompany = await CoOperateCompanyMasterPrivateModel.find({
      delete: false,
    });
    if (!allCooperativeCompany) {
      res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Co-Operative Company found" });
    }
    res.status(httpStatus.OK).json({
      msg: "Co-Operative Company found successfully",
      allCooperativeCompany,
    });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in fetching all the Co-Operative Company" }, err);
  }
};

const updateCooperativeCompanyPrivate = async (req, res) => {
  try {
    const { id } = req.params;
    const { cooperativeCompanyName } = req.body;
    const deletes = false;
    const existingCompany = await CoOperateCompanyMasterPrivateModel.findOne({
      cooperativeCompanyName: cooperativeCompanyName,
      delete: deletes,
    });

    if (existingCompany && existingCompany._id.toString() !== id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "The Co-Operative Company is already exists!!" });
    }

    const newCompany = await CoOperateCompanyMasterPrivateModel.findByIdAndUpdate(
      { _id: id },
      { $set: { ...req.body } },
      { new: true }
    );
    res.status(httpStatus.OK).json({
      message: "Co-Operative Company updated successfully",
      data: newCompany,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in updating the Co-Operative Company", error });
  }
};

const deleteCooperativeCompanyPrivate = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await CoOperateCompanyMasterPrivateModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now(), new: true }
    );

    if (!company) {
      res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "No Co-Operative Company found!!" });
    }
    res
      .status(httpStatus.OK)
      .json({ message: "Co-Operative Private Company deleted successfully!!" });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: "Error in deleting Co-Operative Company!!" });
  }
};

const bulkCooperativeCompanyImportPrivate = async (req, res) => {
  try {
    const CooperativeCompanyData = req.body;
    const result = await CoOperateCompanyMasterPrivateModel.insertMany(
      CooperativeCompanyData
    );
    res
      .status(httpStatus.CREATED)
      .json({ msg: "Co-Operative Private Company Imported", data: result });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

module.exports = {
  addTpaCompany,
  getTpaCompany,
  updateTpaCompany,
  deleteTpaCompany,
  bulkTpaCompanyImport,

  addInsuranceCompany,
  getInsuranceCompany,
  updateInsuranceCompany,
  deleteInsuranceCompany,
  bulkInsuranceCompanyImport,

  addGovermentCompany,
  getGovermentCompany,
  updateGovermentCompany,
  deleteGovermentCompany,
  bulkGovermentCompanyImport,

  addCooperativeCompany,
  getCooperativeCompany,
  updateCooperativeCompany,
  deleteCooperativeCompany,
  bulkCooperativeCompanyImport,

  // Cooperate company private
  bulkCooperativeCompanyImportPrivate,
  deleteCooperativeCompanyPrivate,
  updateCooperativeCompanyPrivate,
  getCooperativeCompanyPrivate,
  addCooperativeCompanyPrivate,
};
