const { default: mongoose } = require("mongoose");
const { vehicleTypeModel } = require("../../../models/index");

const getVehicleTypeController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const vehicleTypes = await vehicleTypeModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!vehicleTypes || vehicleTypes.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No vehicle Type found" });
    }
    // sort data from newest to oldest
    vehicleTypes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ status: "true", data: vehicleTypes });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching vehicle type", error.message],
    });
  }
};

const postVehicleTypeController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const vehicleType = req.body.vehicleType;
    if (!vehicleType) {
      return res
        .status(400)
        .json({ status: "false", message: " vehicle Type is required" });
    }
    const newInsDepartment = new vehicleTypeModel({
      vehicleType,
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    console.log("before save ", newInsDepartment);
    await newInsDepartment.save();
    res.status(201).json({ status: "true", data: newInsDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating  Vehicle Type", error.message],
    });
  }
};

const putVehicleTypeController = async (req, res) => {
  try {
    const id = req.params.id;
    const { vehicleType } = req.body;

    const updatedDepartment = await vehicleTypeModel.findByIdAndUpdate(
      id,
      { vehicleType },
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "Vehicle Type not found" });
    }

    res.status(200).json({ status: "true", data: updatedDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error Updating Vehicle Type", error.message],
    });
  }
};

const deleteVehicleTypeController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedDepartment = await vehicleTypeModel.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "vehicle Type not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "vehicle Type deleted Successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting vehicle Type", error.message],
    });
  }
};

module.exports = {
  getVehicleTypeController,
  postVehicleTypeController,
  putVehicleTypeController,
  deleteVehicleTypeController,
};
