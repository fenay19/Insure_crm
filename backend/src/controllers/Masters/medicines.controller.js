const { MedicinesModel } = require("../../models");
const httpStatus = require("http-status");

const addMedicines = async (req, res) => {
  try {
    const newMedicines = new MedicinesModel(req.body);
    await newMedicines.save();
    res.status(201).json({
      message: "Medicines added successfully",
      Medicines: newMedicines,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in creating a Medicines", error });
  }
};

const getAllMedicines = async (req, res) => {
  try {
    const allMedicines = await MedicinesModel.find({ delete: false });
    if (!allMedicines) {
      res.status(httpStatus.NOT_FOUND).json({ msg: "No Medicines found" });
    }
    res
      .status(httpStatus.OK)
      .json({ msg: "Medicines found successfully", allMedicines });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in fetching all the Medicines" }, err);
  }
};

const updateMedicinesById = async (req, res) => {
  try {
    const Medicines = await MedicinesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res
      .status(httpStatus.OK)
      .json({ msg: "Medicines  Updated Successfully", Medicines });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Medicines Not Found", error });
  }
};

const deleteMedicinesByIds = async (req, res) => {
  try {
    const { ids } = req.body; // Assuming IDs are sent in the request body
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map((id) => id.toString()); // No 'new' keyword required here

    // Delete the Medicines with the provided IDs
    const result = await MedicinesModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Medicines found with the provided IDs" });
    }

    res
      .status(httpStatus.OK)
      .json({ msg: "Medicines deleted successfully", result });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in deleting Medicines", details: err.message });
  }
};

const GetMostMedicinesByIds = async (req, res) => {
  try {
    // const { id } = req.params;

    const Medicines = await MedicinesModel.find({
      delete: false,
      // department: { $in: id }, // Use $in to match any ID in the department array
    })
      .sort({ count: -1 }) // Sort by count in descending order
      .limit(30); // Limit the response to 30 results

    res.status(httpStatus.OK).json({ data: Medicines });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};



const importJson = async (req, res) => {
  try {
    await MedicinesModel.insertMany(req.body);
    res.status(httpStatus.OK).json({ msg: "Medicines imported successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in importing Medicines", details: error.message });
  }
};

module.exports = {
  addMedicines,
  getAllMedicines,
  deleteMedicinesByIds,
  updateMedicinesById,
  GetMostMedicinesByIds,
  importJson,
};
