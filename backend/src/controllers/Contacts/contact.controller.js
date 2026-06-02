// const { companyModel } = require('../../models/index')
const { default: mongoose } = require("mongoose");
const { contactModel } = require("../../models/index");
const { departmentModel } = require("../../models/index");

const getContacts = async (req, res) => {
  try {
    const { companyId } = req.query;
    const contacts = await contactModel
      .find({ companyId: new mongoose.Types.ObjectId(companyId) })
      .lean()
      .sort({ createdAt: -1 });

    // Optional: Attach full department data (from separate model)
    const departments = await departmentModel.find().sort({ createdAt: -1 });
    const enriched = contacts.map((c) => {
      const dept = departments.find((d) => d.department === c.department);
      return {
        ...c,
        departmentDetails: dept || null,
      };
    });

    return res
      .status(200)
      .json({ message: "Contacts fetched", data: enriched });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// CREATE CONTACT
const createContact = async (req, res) => {
  try {
    const {
      companyName = "",
      name = "",
      email = "",
      designation = "",
      phone = "",
      department = "",
    } = req.body;

    const { companyId = "" } = req.query;

    // 🔍 Lookup department by name (only if provided)
    let deptName = "";
    if (department) {
      const dept = await departmentModel.findOne({ department });
      if (!dept) {
        return res.status(400).json({ message: "Invalid department name" });
      }
      deptName = dept.department;
    }

    const newContact = new contactModel({
      companyName,
      name,
      email,
      designation,
      companyId,
      phone,
      department: deptName,
    });

    await newContact.save();
    res
      .status(201)
      .json({ status: true, message: "Contact created", data: newContact });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get the contact by ID, set to top

    // show in the top not bottom
    const contact = await contactModel.findById(id).sort({ createdAt: -1 });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // sort data from newest to oldest
    // contact.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 2. Fetch the full department object using department name
    const dept = await departmentModel.findOne({
      department: contact.department,
    });

    // 3. Attach full department details if found
    contact.departmentDetails = dept || null;

    res
      .status(200)
      .json({ status: true, message: "Contact fetched", data: contact });
  } catch (error) {
    console.error("Error fetching contact by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// UPDATE CONTACT
const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, name, email, designation, phone, department } =
      req.body;

    // Log incoming data for debugging
    console.log("Update Contact:", {
      id,
      companyName,
      name,
      email,
      designation,
      phone,
      department,
    });

    // 🔍 Lookup department by name
    const dept = await departmentModel.findOne({ department });

    if (!dept) {
      return res.status(400).json({ message: "Invalid department name" });
    }

    // Log before update
    const exists = await contactModel.findById(id);
    if (!exists) {
      console.log("Contact not found for update:", id);
      return res.status(404).json({ message: "Contact not found" });
    }

    const updated = await contactModel.findByIdAndUpdate(
      id,
      {
        companyName,
        name,
        email,
        designation,
        phone,
        department: dept.department,
      },
      { new: true }
    );

    // if (!updated) {
    //   return res.status(404).json({ message: "Contact not found" });
    // }

    res
      .status(200)
      .json({ status: true, message: "Contact updated", data: updated });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE CONTACT
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await contactModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
};
