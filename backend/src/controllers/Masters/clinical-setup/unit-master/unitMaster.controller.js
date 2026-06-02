const clinicalUnitMasterModel = require("../../../../models/Masters/clinical-setup/unit-master/unitMaster.model");

const httpStatus = require("http-status");

// Create a new unit
const createUnit = async (req, res) => {
  try {
    const { unit } = req.body.inputData;

    if (!unit) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: "Unit is required" });
    }

    const existingUnit = await clinicalUnitMasterModel.findOne({ unit });

    if (existingUnit) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ error: "Unit already exists" });
    }

    const newUnit = new clinicalUnitMasterModel({ unit });
    await newUnit.save();
    console.log(unit);

    return res
      .status(httpStatus.CREATED)
      .json({ message: "Unit added successfully", unit: newUnit });
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

// Get all units
const getAllUnits = async (req, res) => {
  try {
    const units = await clinicalUnitMasterModel.find({ delete: false });
    return res.status(httpStatus.OK).json({ units });
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

// Get a single unit by ID
const getUnitById = async (req, res) => {
  try {
    const { id } = req.params;
    const unit = await clinicalUnitMasterModel.findById(id);

    if (!unit) {
      return res.status(httpStatus.NOT_FOUND).json({ error: "Unit not found" });
    }

    return res.status(httpStatus.OK).json({ unit });
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

// Update a unit by ID
const updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { unit } = req.body;

    console.log(id, unit);

    if (!unit) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: "Unit is required" });
    }

    const updatedUnit = await clinicalUnitMasterModel.findByIdAndUpdate(
      id,
      { unit },
      { new: true }
    );

    if (!updatedUnit) {
      return res.status(httpStatus.NOT_FOUND).json({ error: "Unit not found" });
    }

    return res.status(httpStatus.OK).json({
      message: "Unit updated successfully",
      unit: updatedUnit,
      success: true,
    });
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

// Delete a unit by ID

const deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const unit = await clinicalUnitMasterModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now(), new: true }
    );
    if (!unit) {
      return res.status(httpStatus.NOT_FOUND).json({ error: "Unit not found" });
    }
    res.status(httpStatus.OK).json({ msg: "Unit deleted successfully" });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

module.exports = {
  createUnit,
  getAllUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
};
