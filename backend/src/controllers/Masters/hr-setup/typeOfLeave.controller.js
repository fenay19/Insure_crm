const { TypeOfLeaveMasterModel } = require('../../../models'); // Adjust the path as per your project structure

// Create a new type of leave entry
const createTypeOfLeave = async (req, res) => {
  try {
    const { inputData } = req.body;

    if (!inputData || !inputData.typeOfLeave) {
      return res
        .status(400)
        .json({ success: false, message: 'Leave type name is required' });
    }

    const newLeaveType = new TypeOfLeaveMasterModel(inputData);
    await newLeaveType.save();

    res.status(201).json({
      success: true,
      message: 'Leave type created successfully',
      data: newLeaveType,
    });
  } catch (error) {
    console.error('Error creating leave type:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Fetch all leave types
const getAllTypesOfLeave = async (req, res) => {
  try {
    const leaveTypes = await TypeOfLeaveMasterModel.find({ delete: false });

    res.status(200).json({
      success: true,
      message: 'Leave types fetched successfully',
      data: leaveTypes,
    });
  } catch (error) {
    console.error('Error fetching leave types:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update a specific leave type
const updateTypeOfLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { inputData } = req.body;

    if (!inputData) {
      return res
        .status(400)
        .json({ success: false, message: 'Leave type name is required' });
    }

    const updatedLeaveType = await TypeOfLeaveMasterModel.findByIdAndUpdate(
      id,
      inputData,
      { new: true }
    );

    if (!updatedLeaveType) {
      return res
        .status(404)
        .json({ success: false, message: 'Leave type not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Leave type updated successfully',
      data: updatedLeaveType,
    });
  } catch (error) {
    console.error('Error updating leave type:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Soft delete a specific leave type
const deleteTypeOfLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLeaveType = await TypeOfLeaveMasterModel.findByIdAndUpdate(
      id,
      { delete: true },
      { new: true }
    );

    if (!deletedLeaveType) {
      return res
        .status(404)
        .json({ success: false, message: 'Leave type not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Leave type deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting leave type:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Export all controllers
module.exports = {
  createTypeOfLeave,
  getAllTypesOfLeave,
  updateTypeOfLeave,
  deleteTypeOfLeave,
};
