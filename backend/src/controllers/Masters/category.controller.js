const { ParentGroupModel } = require("../../models");
const { PayeeParentGroupModel } = require("../../models");
const { PatientPayeeModel } = require("../../models");
const { CategoryMasterModel } = require("../../models");
const httpStatus = require("http-status");

// parent group
const addParentGroup = async (req, res) => {
  try {
    const { parentGroupName } = req.body;
    const existingParentGroup = await ParentGroupModel.findOne({
      parentGroupName: parentGroupName,
      delete: false,
    });
    console.log(existingParentGroup);
    if (existingParentGroup) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Parent group name already exists!!" });
    }
    const newParentGroup = new ParentGroupModel({ parentGroupName });
    await newParentGroup.save();
    res.status(httpStatus.CREATED).json({
      msg: "Parent group added successfully!!",
      ParentGroup: newParentGroup,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
    console.log(error);
  }
};

const getAllParentGroup = async (req, res) => {
  try {
    const parentGroups = await ParentGroupModel.find({ delete: false });
    res.status(httpStatus.OK).json({ data: parentGroups });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateParentGroupById = async (req, res) => {
  const { id } = req.params;
  try {
    const { parentGroupName } = req.body;
    const existingParentGroup = await ParentGroupModel.findOne({
      parentGroupName,
      delete: false,
    });
    if (existingParentGroup && existingParentGroup._id.toString() !== id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Parent group name already exists!!" });
    }
    const parentGroup = await ParentGroupModel.findByIdAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );
    if (!parentGroup) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Parent group not found" });
    }
    res
      .status(httpStatus.OK)
      .json({ msg: "Parent group Updated", data: parentGroup });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deleteParentGroupById = async (req, res) => {
  const { id } = req.params;
  try {
    const parentGroup = await ParentGroupModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now(), new: true }
    );
    if (!parentGroup) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Parent Group not found" });
    }
    res.status(httpStatus.OK).json({ msg: "Parent Group Deleted" });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const importParentGroup = async (req, res) => {
  try {
    const parentGroupData = req.body;
    if (parentGroupData.length <= 0) {
      return res.status().json({ msg: "Please send valid data" });
    }
    const result = await ParentGroupModel.insertMany(parentGroupData);
    res
      .status(httpStatus.CREATED)
      .json({ msg: "Parent Category Imported", data: result });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

// payee parent master

const addPayeeParentGroup = async (req, res) => {
  try {
    const { payeeParentName, parentGroup, parentGroupId, rateChart } = req.body;
    const newPayeeParentGroup = new PayeeParentGroupModel({
      payeeParentName,
      parentGroup,
      parentGroupId,
      rateChart,
    });
    await newPayeeParentGroup.save();

    res.status(httpStatus.CREATED).json({
      msg: "Payee parent group added successfully!!",
      Payeeparentgroup: newPayeeParentGroup,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
};

const getAllPayeeParentGroup = async (req, res) => {
  try {
    const payeeParentGroups = await PayeeParentGroupModel.find({
      delete: false,
    });
    res.status(httpStatus.OK).json({ data: payeeParentGroups });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updatePayeeParentGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const parentGroup = await PayeeParentGroupModel.findByIdAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );
    if (!parentGroup) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Payee Parent group not found" });
    }
    res
      .status(httpStatus.OK)
      .json({ msg: "Payee Parent group Updated", data: parentGroup });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deletePayeeParentGroupById = async (req, res) => {
  const { id } = req.params;
  try {
    const payeeParentGroup = await PayeeParentGroupModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now(), new: true }
    );
    if (!payeeParentGroup) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Payee parent Group not found" });
    }
    res.status(httpStatus.OK).json({ msg: "Payee parent Group Deleted" });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const importParentPayeeGroup = async (req, res) => {
  try {
    const parentPayeeData = req.body;
    if (parentPayeeData.length <= 0) {
      return res.status().json({ msg: "Please send valid data" });
    }
    const result = await PayeeParentGroupModel.insertMany(parentPayeeData);
    res
      .status(httpStatus.CREATED)
      .json({ msg: "Parent Category Imported", data: result });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

// patient payee

const addPatientPayee = async (req, res) => {
  try {
    const { licNo } = req.body;
    const existinglicNo = await PatientPayeeModel.findOne({
      licNo,
      delete: false,
    });
    if (existinglicNo) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Patient Payee Lic No. already exists!!" });
    }
    const newPatientPayee = new PatientPayeeModel(req.body);
    await newPatientPayee.save();

    res.status(httpStatus.CREATED).json({
      msg: "Patient Payee added successfully!!",
      PatientPayee: newPatientPayee,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
};

const getAllPatientPayee = async (req, res) => {
  try {
    const patientPayee = await PatientPayeeModel.find({ delete: false });
    res.status(httpStatus.OK).json({ data: patientPayee });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updatePatientPayeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { licNo } = req.body;
    const existinglicNo = await PatientPayeeModel.findOne({
      licNo,
      delete: false,
    });
    if (existinglicNo && existinglicNo._id.toString() !== id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Patient Payee Lic No. already exists!!" });
    }
    const patientPayee = await PatientPayeeModel.findByIdAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );
    if (!patientPayee) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Patient payee not found" });
    }
    res
      .status(httpStatus.OK)
      .json({ msg: "Patient payee Updated", data: patientPayee });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deletePatientPayeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const patientPayee = await PatientPayeeModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now(), new: true }
    );
    if (!patientPayee) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Patient payee not found" });
    }
    res.status(httpStatus.OK).json({ msg: "Patient payee Deleted" });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const importPatientPayee = async (req, res) => {
  try {
    const patientPayeeData = req.body;
    if (patientPayeeData.length <= 0) {
      return res.status().json({ msg: "Please send valid data" });
    }
    const result = await PatientPayeeModel.insertMany(patientPayeeData);
    res
      .status(httpStatus.CREATED)
      .json({ msg: "Patient Category Imported", data: result });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

// category

const addcategory = async (req, res) => {
  try {
    const newCategory = new CategoryMasterModel(req.body);
    await newCategory.save();
    res
      .status(httpStatus.CREATED)
      .json({ msg: "Category added successfully!!", Category: newCategory });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const newCategory = await CategoryMasterModel.find({ delete: false });
    res.status(httpStatus.OK).json({ data: newCategory });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const newCategory = await CategoryMasterModel.findByIdAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );
    if (!newCategory) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Category not found" });
    }
    res
      .status(httpStatus.OK)
      .json({ msg: "Category Updated", data: newCategory });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deleteCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const newCategory = await CategoryMasterModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now(), new: true }
    );
    if (!newCategory) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Category not found" });
    }
    res.status(httpStatus.OK).json({ msg: "Category Deleted" });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const bulkImport = async (req, res) => {
  try {
    const category = req.body;
    const newArray = [];

    const ParentGroupM = await ParentGroupModel.find({ delete: false });
    const PayeeParentGroupM = await PayeeParentGroupModel.find({
      delete: false,
    });
    const PatientPayeeM = await PatientPayeeModel.find({ delete: false });

    for (const item of category) {
      const parentGroup = ParentGroupM.find(
        (el) => item.parentGroup === el.parentGroupName
      );
      if (!parentGroup) {
        return res.status(400).json({
          error: `Parent group '${item.parentGroup}' not found`,
        });
      }

      const payeeParent = PayeeParentGroupM.find(
        (el) => item.parentPayee === el.payeeParentName
      );
      if (!payeeParent) {
        return res.status(400).json({
          error: `Payee parent group '${item.parentPayee}' not found`,
        });
      }

      const patientPayee = PatientPayeeM.find(
        (el) => item.patientPayee === el.payeeName
      );
      if (!patientPayee) {
        return res.status(400).json({
          error: `Patient payee '${item.patientPayee}' not found`,
        });
      }

      item.patientPayeeId = patientPayee._id;
      item.parentGroupId = parentGroup._id;
      item.parentPayeeId = payeeParent._id;

      newArray.push(item);
    }

    const result = await CategoryMasterModel.insertMany(newArray);

    res.status(httpStatus.CREATED).json({
      msg: "Patient category added successfully!!",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error",
    });
  }
};

module.exports = {
  addParentGroup,
  getAllParentGroup,
  updateParentGroupById,
  deleteParentGroupById,

  addPayeeParentGroup,
  getAllPayeeParentGroup,
  updatePayeeParentGroupById,
  deletePayeeParentGroupById,

  addPatientPayee,
  getAllPatientPayee,
  updatePatientPayeeById,
  deletePatientPayeeById,

  addcategory,
  getAllCategory,
  updateCategoryById,
  deleteCategoryById,
  bulkImport,
  importParentGroup,
  importParentPayeeGroup,
  importPatientPayee,
};
