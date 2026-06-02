const EntryModel = require('../../../models/Masters/hr-setup/entry.model');


const createEntry = async (req, res) => {
  console.log("req", req.body);
  try {
    const { percentage, selectedItems, employee, employer } = req.body;
    console.log('Received payload:', req.body);

    // Validate all required fields
    if (percentage === undefined || percentage === null) {
      return res.status(400).json({
        success: false,
        message: 'Percentage field is required'
      });
    }
    if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Selected items must be a non-empty array'
      });
    }
    if (!employee || !employer) {
      return res.status(400).json({
        success: false,
        message: 'Employee and Employer fields are required'
      });
    }

    // Create the new entry
    const newEntry = new EntryModel({
      percentage,  // Use 'percentage' here, not 'inputValue'
      selectedItems,
      employee,
      employer
    });

    console.log("newEntry-----", newEntry);
    await newEntry.save();
    
    // Send success response
    res.status(201).json({
      success: true,
      message: 'Entry created successfully',
      data: newEntry
    });

  } catch (error) {
    // Log the actual error message to help with debugging
    console.error('Error creating Entry:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message  // Send back error details in the response
    });
  }
};

  
const getEntry = async (req, res) => {
  try {
    const entries = await EntryModel.find({ delete: false }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Entry fetched successfully',
      data: entries
    });
  } catch (error) {
    console.error('Error fetching Entry:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    console.log("Updating entry ID:", id);
    console.log("Data to update:", updatedData);

    const updatedEntry = await EntryModel.findByIdAndUpdate(id, updatedData, {
      new: true, // return the updated document
      runValidators: true // ensure validation runs
    });

    if (!updatedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID is required'
      });
    }

    const deletedEntry = await EntryModel.findByIdAndUpdate(
      id,
      { delete: true },
      { new: true }
    );

    if (!deletedEntry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting Entry:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createEntry,
  getEntry,
  updateEntry,
  deleteEntry
};
