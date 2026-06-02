const { default: mongoose } = require("mongoose");
const { departmentModel } = require("../../../models/index");

const getDepartmentController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const departments = await departmentModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!departments || departments.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No departments found" });
    }
    // sort data from newest to oldest
    departments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ status: "true", data: departments });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching positions", error.message],
    });
  }
};

const postDepartmentController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const department = req.body.department;
    if (!department) {
      return res
        .status(400)
        .json({ status: "false", message: "department is required" });
    }

    const newDepartment = new departmentModel({ department, companyId });
    await newDepartment.save();
    res.status(201).json({ status: "true", data: newDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating department", error.message],
    });
  }
};

const putDepartmentController = async (req, res) => {
  try {
    const id = req.params.id;
    const { department } = req.body;

    const updatedDepartment = await departmentModel.findByIdAndUpdate(
      id,
      { department },
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "Department not found" });
    }

    res.status(200).json({ status: "true", data: updatedDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error Updating Department", error.message],
    });
  }
};

const deleteDepartmentController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedDepartment = await departmentModel.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "Department not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "Department deleted Successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting Department", error.message],
    });
  }
};

module.exports = {
  getDepartmentController,
  postDepartmentController,
  putDepartmentController,
  deleteDepartmentController,
};
