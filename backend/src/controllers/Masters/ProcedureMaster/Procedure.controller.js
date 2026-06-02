const httpStatus = require("http-status");
const ProcedureModel = require("../../../models/Masters/ProcedureMaster/Procedure.model");

// ✅ Get all procedures
const getAllProcedures = async (req, res) => {
  try {
    const procedures = await ProcedureModel.find({ delete: false });
    return res.status(httpStatus.OK).json({
      msg: "Procedures retrieved successfully",
      data: procedures,
    });
  } catch (error) {
    res.status(500).json({ err: "Server Error", error });
  }
};

// ✅ Add a new procedure
const addProcedure = async (req, res) => {
  try {
    const { procedureName } = req.body;
    console.log(procedureName)
    
    if (!procedureName) {
      return res
        .status(400)
        .json({ msg: "Please provide all required fields" });
    }

    const newProcedure = new ProcedureModel({ procedureName });
    console.log('created')
    await newProcedure.save();
    console.log('created 2')

    return res.status(httpStatus.CREATED).json({
      msg: "Procedure added successfully",
      procedure: newProcedure,
    });
  } catch (error) {
    res.status(500).json({ err: "Server Error", error });
  }
};

// ✅ Update procedure
const editProcedure = async (req, res) => {
  try {
    const { id } = req.params;
    const procedure = await ProcedureModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!procedure) {
      return res.status(400).json({ msg: "Procedure not found" });
    }

    return res.status(httpStatus.OK).json({
      msg: "Procedure updated successfully",
      procedure,
    });
  } catch (error) {
    res.status(500).json({ err: "Server Error", error });
  }
};

// ✅ Soft delete procedure
const deleteProcedure = async (req, res) => {
  try {
    const { id } = req.params;
    const procedure = await ProcedureModel.findByIdAndUpdate(
      id,
      { delete: true, deletedAt: Date.now() },
      { new: true }
    );

    if (!procedure) {
      return res.status(400).json({ msg: "Procedure not found" });
    }

    return res
      .status(httpStatus.OK)
      .json({ msg: "Procedure deleted successfully" });
  } catch (error) {
    res.status(500).json({ err: "Server Error", error });
  }
};

// ✅ Bulk import procedures
const bulkImportProcedures = async (req, res) => {
  try {
    const procedures = req.body;

    if (!Array.isArray(procedures) || procedures.length === 0) {
      return res.status(400).json({ msg: "Invalid data for bulk import" });
    }

    const result = await ProcedureModel.insertMany(procedures);

    return res.status(httpStatus.CREATED).json({
      msg: "Procedures added successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ err: "Server Error", error });
  }
};

module.exports = {
  addProcedure,
  getAllProcedures,
  editProcedure,
  deleteProcedure,
  bulkImportProcedures,
};
