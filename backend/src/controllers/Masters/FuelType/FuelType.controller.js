const { default: mongoose } = require("mongoose");
const { fuelTypeModel } = require("../../../models/index");

const getFuelTypeController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const fuelTypes = await fuelTypeModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!fuelTypes || fuelTypes.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No Fuel Type found" });
    }
    // sort data from newest to oldest
    fuelTypes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ status: "true", data: fuelTypes });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching fuel type", error.message],
    });
  }
};

const postFuelTypeController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const fuelType = req.body.fuelType;
    if (!fuelType) {
      return res
        .status(400)
        .json({ status: "false", message: " Fuel Type is required" });
    }
    console.log("Fuel Tpe ", fuelType, companyId);
    const newInsDepartment = new fuelTypeModel({
      fuelType,
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    console.log("before save ", newInsDepartment);
    await newInsDepartment.save();
    res.status(201).json({ status: "true", data: newInsDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating  Fuel Type", error.message],
    });
  }
};

const putFuelTypeController = async (req, res) => {
  try {
    const id = req.params.id;
    const { fuelType } = req.body;

    const updatedDepartment = await fuelTypeModel.findByIdAndUpdate(
      id,
      { fuelType },
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "Fuel Type not found" });
    }

    res.status(200).json({ status: "true", data: updatedDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error Updating Fuel Type", error.message],
    });
  }
};

const deleteFuelTypeController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedDepartment = await fuelTypeModel.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "Fuel Type not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "Fuel Type deleted Successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting Fuel Type", error.message],
    });
  }
};

module.exports = {
  getFuelTypeController,
  postFuelTypeController,
  putFuelTypeController,
  deleteFuelTypeController,
};
