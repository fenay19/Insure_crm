const { AdminContactPersonModel } = require("../../models/index");

// get all contact person details
const getAllAdminContactPerson = async (req, res) => {
  try {
    const contactPerson = await AdminContactPersonModel.find();

    if (!contactPerson || contactPerson.length === 0) {
      return res.status(404).json({ message: "Contact person not found" });
    }

    return res.status(200).json({ status: "true", data: contactPerson });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createAdminContactPerson = async (req, res) => {
  try {
    const { name, department, position, email, phone } = req.body;

    if (!name || !department || !position || !email || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new contact person
    const contactPerson = new AdminContactPersonModel({
      name,
      department,
      position,
      email,
      phone,
    });

    // Save the contact person to the database
    await contactPerson.save();

    return res.status(201).json({
      status: "true",
      message: "Contact person created successfully",
      data: contactPerson,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creating contact person" });
  }
};

const updateAdminContactPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, position, email, phone } = req.body;

    const contactPerson = await AdminContactPersonModel.findByIdAndUpdate(
      id,
      {
        name,
        department,
        position,
        email,
        phone,
      },
      { new: true, runValidators: true }
    );

    if (!contactPerson) {
      return res.status(404).json({ message: "Contact person not found" });
    }

    return res.status(200).json({
      status: "true",
      message: "Contact person updated successfully",
      data: contactPerson,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating contact person" });
  }
};

const deleteAdminContactPerson = async (req, res) => {
  try {
    const { id } = req.params;

    const contactPerson = await AdminContactPersonModel.findByIdAndDelete(id);

    if (!contactPerson) {
      return res.status(404).json({ message: "Contact person not found" });
    }

    return res.status(200).json({
      status: "true",
      message: "Contact person deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting contact person" });
  }
};

// get contact person details by id
const getAdminContactPersonById = async (req, res) => {
  try {
    const { id } = req.params;

    const contactPerson = await AdminContactPersonModel.findById(id);

    if (!contactPerson) {
      return res.status(404).json({ message: "Contact person not found" });
    }

    return res.status(200).json({ status: "true", data: contactPerson });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching contact person details" });
  }
};

module.exports = {
  getAllAdminContactPerson,
  createAdminContactPerson,
  updateAdminContactPerson,
  deleteAdminContactPerson,
  getAdminContactPersonById,
};
