const AgeGroupModel = require("../../../models/Masters/clinical-setup/age-group-master/ageGroup.model");
const httpStatus = require("http-status");

// Create a new Age Group
const createAgeGroup = async (req, res) => {
  try {
    const { age, group } = req.body.inputData;

    if (!age || !group) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Age and Group are required" });
    }

    const newAgeGroup = new AgeGroupModel({ age, group });
    await newAgeGroup.save();

    res.status(httpStatus.CREATED).json({
      message: "Age group created successfully",
      data: newAgeGroup,
      success: true,
    });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating age group", error: err.message });
  }
};

// Get all Age Groups
const getAllAgeGroups = async (req, res) => {
  try {
    const ageGroups = await AgeGroupModel.find({ delete: false });
    res
      .status(httpStatus.OK)
      .json({ message: "Age groups fetched successfully", data: ageGroups });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching age groups", error: err.message });
  }
};

// Get an Age Group by ID
const getAgeGroupById = async (req, res) => {
  try {
    const { id } = req.params;

    const ageGroup = await AgeGroupModel.findById(id);
    if (!ageGroup) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Age group not found" });
    }

    res
      .status(httpStatus.OK)
      .json({ message: "Age group fetched successfully", data: ageGroup });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching age group", error: err.message });
  }
};

// Update an Age Group
const updateAgeGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { age, group } = req.body?.inputData;
    console.log("ae", id, age, group);

    const updatedAgeGroup = await AgeGroupModel.findByIdAndUpdate(
      id,
      { age, group },
      { new: true, runValidators: true }
    );

    if (!updatedAgeGroup) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Age group not found" });
    }

    res.status(httpStatus.OK).json({
      message: "Age group updated successfully",
      data: updatedAgeGroup,
      success: true,
    });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating age group", error: err.message });
  }
};

// Delete an Age Group
const deleteAgeGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAgeGroup = await AgeGroupModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now(), new: true }
    );

    if (!deletedAgeGroup) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Age group not found" });
    }

    res.status(httpStatus.OK).json({
      message: "Age group deleted successfully",
      data: deletedAgeGroup,
      success: true,
    });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error deleting age group", error: err.message });
  }
};

module.exports = {
  createAgeGroup,
  getAllAgeGroups,
  getAgeGroupById,
  updateAgeGroup,
  deleteAgeGroup,
};
