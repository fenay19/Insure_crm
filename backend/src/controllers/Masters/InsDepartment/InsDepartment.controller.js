const { default: mongoose } = require("mongoose");
const { insDepartmentModel } = require("../../../models/index");

const getInsDepartmentController = async (req, res) => {
  try {
    const { companyId } = req.query;
    console.log("inside isnDepartment", companyId);
    const insDepartments = await insDepartmentModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!insDepartments || insDepartments.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No Insurance Departments found" });
    }
    // sort data from newest to oldest
    insDepartments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({ status: "true", data: insDepartments });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching positions", error.message],
    });
  }
};

const postInsDepartmentController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const insDepartment = req.body.insDepartment;
    if (!insDepartment) {
      return res.status(400).json({
        status: "false",
        message: " Insurance Department is required",
      });
    }

    const newInsDepartment = new insDepartmentModel({
      insDepartment,
      companyId,
    });
    await newInsDepartment.save();
    res.status(201).json({ status: "true", data: newInsDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating  Insurance Department", error.message],
    });
  }
};

const putInsDepartmentController = async (req, res) => {
  try {
    const id = req.params.id;
    const { insDepartment } = req.body;

    const updatedDepartment = await insDepartmentModel.findByIdAndUpdate(
      id,
      { insDepartment },
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

const deleteInsDepartmentController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedDepartment = await insDepartmentModel.findByIdAndDelete(id);

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
  getInsDepartmentController,
  postInsDepartmentController,
  putInsDepartmentController,
  deleteInsDepartmentController,
};
