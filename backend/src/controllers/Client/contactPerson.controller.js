const { ContactPersonModel } = require("../../models/index");

// get all contact person details
const getAllContactPerson = async (req, res) => {
  try {
    const contactPerson = await ContactPersonModel.find();

    if (!contactPerson || contactPerson.length === 0) {
      return res.status(404).json({ message: "Contact person not found" });
    }

    return res.status(200).json({ status: "true", data: contactPerson });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createContactPerson = async (req, res) => {
  try {
    const { name, department, position, email, phone } = req.body;

    if (!name || !department || !position || !email || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new contact person
    const contactPerson = new ContactPersonModel({
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

const updateContactPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, position, email, phone } = req.body;

    const contactPerson = await ContactPersonModel.findByIdAndUpdate(
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

const deleteContactPerson = async (req, res) => {
  try {
    const { id } = req.params;

    const contactPerson = await ContactPersonModel.findByIdAndDelete(id);

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
const getContactPersonById = async (req, res) => {
  try {
    const { id } = req.params;

    const contactPerson = await ContactPersonModel.findById(id);

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
  getAllContactPerson,
  createContactPerson,
  updateContactPerson,
  deleteContactPerson,
  getContactPersonById,
};
