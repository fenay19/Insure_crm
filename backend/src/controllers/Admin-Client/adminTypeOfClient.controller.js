const { AdminTypeOfClientModel } = require("../../models/index");

const getAdminTypeOfClient = async (req, res) => {
  try {
    const typeOfClient = await AdminTypeOfClientModel.find();

    // if no type of client found
    if (!typeOfClient || typeOfClient.length === 0) {
      return res.status(404).json({ message: "Type of client not found" });
    }

    // sort data from newest to oldest
    typeOfClient.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // b is newer, a is older
    );

    return res.status(200).json({ status: "true", data: typeOfClient });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// get type of client by id
const getAdminTypeOfClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const typeOfClient = await AdminTypeOfClientModel.findById(id);

    if (!typeOfClient) {
      return res.status(404).json({ message: "Type of client not found" });
    }

    return res.status(200).json({ status: "true", data: typeOfClient });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching type of client" });
  }
};

// create a new type of client
const createAdminTypeOfClient = async (req, res) => {
  try {
    const { typeOfClient } = req.body;

    if (!typeOfClient) {
      return res.status(400).json({ message: "Type of client is required" });
    }

    // Create a new type of client
    const newTypeOfClient = new AdminTypeOfClientModel({ typeOfClient });

    // Save the type of client to the database
    await newTypeOfClient.save();

    return res.status(201).json({
      status: "true",
      message: "Type of client created successfully",
      data: newTypeOfClient,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creating type of client" });
  }
};

// update a type of client
const updateAdminTypeOfClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { typeOfClient } = req.body;

    if (!typeOfClient) {
      return res.status(400).json({ message: "Type of client is required" });
    }

    // Update the type of client in the database
    const updatedTypeOfClient = await AdminTypeOfClientModel.findByIdAndUpdate(
      id,
      { typeOfClient },
      { new: true, runValidators: true }
    );

    if (!updatedTypeOfClient) {
      return res.status(404).json({ message: "Type of client not found" });
    }

    return res.status(200).json({
      status: "true",
      message: "Type of client updated successfully",
      data: updatedTypeOfClient,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating type of client" });
  }
};

const deleteAdminTypeOfClient = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTypeOfClient = await AdminTypeOfClientModel.findByIdAndDelete(id);

    if (!deletedTypeOfClient) {
      return res.status(404).json({ message: "Type of client not found" });
    }

    return res.status(200).json({
      status: "true",
      message: "Type of client deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting type of client" });
  }
};

module.exports = {
  getAdminTypeOfClient,
  getAdminTypeOfClientById,
  createAdminTypeOfClient,
  updateAdminTypeOfClient,
  deleteAdminTypeOfClient,
};
