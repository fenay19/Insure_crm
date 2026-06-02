const VitalMasterModel = require("../../../../models/Masters/clinical-setup/vitals-master/vital.model");
const httpStatus = require("http-status");

const createVitals = async (req, res) => {
  try {
    const { vital, age, group, unit, range } = req.body.inputData;
    if ([vital, age, group.unit, range]?.some((item) => item?.trim() === "")) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: "All fields is required" });
    }
    const newVital = new VitalMasterModel({
      vital,
      age,
      group,
      unit,
      range,
    });

    await newVital.save();
    res.status(httpStatus.CREATED).json({
      message: "Vitals created successfully",
      data: newVital,
      success: true,
    });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating age group", error: err.message });
  }
};

const getAllVitals = async (req, res) => {
  try {
    const vitals = await VitalMasterModel.find({ delete: false });
    return res.status(httpStatus.OK).json({ data: vitals });
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

const updateVitals = async (req, res) => {
  try {
    const { id } = req.params;
    const { vital, age, group, unit, range } = req.body?.inputData;

    const updateVitals = await VitalMasterModel.findByIdAndUpdate(
      id,
      { vital, age, group, unit, range },
      { new: true, runValidators: true }
    );

    if (!updateVitals) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Vital group not found" });
    }

    res.status(httpStatus.OK).json({
      message: "Vitals  updated successfully",
      data: updateVitals,
      success: true,
    });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating age group", error: err.message });
  }
};

const deleteVitals = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteVitals = await VitalMasterModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now(), new: true }
    );

    if (!deleteVitals) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Vital not found" });
    }

    res.status(httpStatus.OK).json({
      message: "Vital deleted successfully",
      data: deleteVitals,
      success: true,
    });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error deleting age group", error: err.message });
  }
};

module.exports = {
  createVitals,
  getAllVitals,
  updateVitals,
  deleteVitals,
};
