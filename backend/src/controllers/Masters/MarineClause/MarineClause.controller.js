const { default: mongoose } = require("mongoose");
const { marineClauseModel } = require("../../../models/index");

const getMarineClauseController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const marineClauses = await marineClauseModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!marineClauses || marineClauses.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No marine clauses found" });
    }
    // sort data from newest to oldest
    marineClauses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ status: "true", data: marineClauses });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching marine clauses", error.message],
    });
  }
};

const postMarineClauseController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const marineClause = req.body.marineClause;
    if (!marineClause) {
      return res
        .status(400)
        .json({ status: "false", message: " marine clause is required" });
    }
    const newInsDepartment = new marineClauseModel({
      marineClause,
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    await newInsDepartment.save();
    res.status(201).json({ status: "true", data: newInsDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating  marine clause", error.message],
    });
  }
};

const putMarineClauseController = async (req, res) => {
  try {
    const id = req.params.id;
    const { marineClause } = req.body;

    const updatedDepartment = await marineClauseModel.findByIdAndUpdate(
      id,
      { marineClause },
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "marine Clause not found" });
    }

    res.status(200).json({ status: "true", data: updatedDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error Updating marine Clause", error.message],
    });
  }
};

const deleteMarineClauseController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedDepartment = await marineClauseModel.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "marine clause not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "marine clause deleted Successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting marine clause", error.message],
    });
  }
};

module.exports = {
  getMarineClauseController,
  postMarineClauseController,
  putMarineClauseController,
  deleteMarineClauseController,
};
