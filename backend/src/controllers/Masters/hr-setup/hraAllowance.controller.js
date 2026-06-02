const { HRAAllowanceMasterModel } = require('../../../models');

// Create HRA Allowance
const createHRAAllowance = async (req, res) => {
  try {
    const { HRA } = req.body;

    if (!HRA && HRA !== 0) {
      return res.status(400).json({
        success: false,
        message: 'HRA field is required',
      });
    }

    const newHRA = new HRAAllowanceMasterModel({ HRA });
    await newHRA.save();

    res.status(201).json({
      success: true,
      message: 'HRA Allowance created successfully',
      data: newHRA,
    });
  } catch (error) {
    console.error('Error creating HRA Allowance:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get All HRA Allowances
const getAllHRAAllowances = async (req, res) => {
  try {
    const allowances = await HRAAllowanceMasterModel.find({ delete: false }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: 'HRA Allowances fetched successfully',
      data: allowances,
    });
  } catch (error) {
    console.error('Error fetching HRA Allowances:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update HRA Allowance
const updateHRAAllowance = async (req, res) => {
  try {
    const { id } = req.params;
    const { HRA } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID is required',
      });
    }

    if (!HRA && HRA !== 0) {
      return res.status(400).json({
        success: false,
        message: 'HRA field is required',
      });
    }

    const updatedHRA = await HRAAllowanceMasterModel.findByIdAndUpdate(
      id,
      { HRA },
      { new: true, runValidators: true }
    );

    if (!updatedHRA) {
      return res.status(404).json({
        success: false,
        message: 'HRA Allowance not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'HRA Allowance updated successfully',
      data: updatedHRA,
    });
  } catch (error) {
    console.error('Error updating HRA Allowance:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete HRA Allowance (Soft Delete)
const deleteHRAAllowance = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID is required',
      });
    }

    const deletedHRA = await HRAAllowanceMasterModel.findByIdAndUpdate(
      id,
      { delete: true },
      { new: true }
    );

    if (!deletedHRA) {
      return res.status(404).json({
        success: false,
        message: 'HRA Allowance not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'HRA Allowance deleted successfully',
      data: deletedHRA,
    });
  } catch (error) {
    console.error('Error deleting HRA Allowance:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createHRAAllowance,
  getAllHRAAllowances,
  updateHRAAllowance,
  deleteHRAAllowance,
};
