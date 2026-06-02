const { DearnessAllowanceModel } = require('../../../models')

// Create Dearness Allowance
const createDearnessAllowance = async (req, res) => {
    try {
    
      const { DA } = req.body

      if (!DA && DA !== 0) {
        return res.status(400).json({
          success: false,
          message: 'DA field is required'
        })
      }

      const newDA = new DearnessAllowanceModel({ DA })
      await newDA.save()

      res.status(201).json({
        success: true,
        message: 'Dearness Allowance created successfully',
        data: newDA
      })
    } catch (error) {
      console.error('Error creating Dearness Allowance:', error.message)
      res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

// Read (Get All) Dearness Allowances
const getAllDearnessAllowances = async (req, res) => {
  try {
    const allowances = await DearnessAllowanceModel.find({
      delete: false
    }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      message: 'Dearness Allowances fetched successfully',
      data: allowances
    })
  } catch (error) {
    console.error('Error fetching Dearness Allowances:', error.message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Update Dearness Allowance
const updateDearnessAllowance = async (req, res) => {
  try {
    const { id } = req.params
    const { DA } = req.body

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID is required'
      })
    }

    if (!DA && DA !== 0) {
      return res.status(400).json({
        success: false,
        message: 'DA field is required'
      })
    }

    const updatedDA = await DearnessAllowanceModel.findByIdAndUpdate(
      id,
      { DA },
      { new: true, runValidators: true }
    )

    if (!updatedDA) {
      return res.status(404).json({
        success: false,
        message: 'Dearness Allowance not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Dearness Allowance updated successfully',
      data: updatedDA
    })
  } catch (error) {
    console.error('Error updating Dearness Allowance:', error.message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Delete Dearness Allowance (Soft Delete)
const deleteDearnessAllowance = async (req, res) => {
   
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID is required'
      })
    }

    const deletedDA = await DearnessAllowanceModel.findByIdAndUpdate(
      id,
      { delete: true },
      { new: true }
    )

    if (!deletedDA) {
      return res.status(404).json({
        success: false,
        message: 'Dearness Allowance not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Dearness Allowance deleted successfully',
      data: deletedDA
    })
  } catch (error) {
    console.error('Error deleting Dearness Allowance:', error.message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

module.exports = {
  createDearnessAllowance,
  getAllDearnessAllowances,
  updateDearnessAllowance,
  deleteDearnessAllowance
}
