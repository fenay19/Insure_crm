const { GraduationMasterModel } = require('../../../models') // Adjust the path as per your project structure

// Create a new graduation entry
const createGraduation = async (req, res) => {
  try {
    const { inputData } = req.body

    if (!inputData || !inputData.graduation) {
      return res
        .status(400)
        .json({ success: false, message: 'Graduation field is required' })
    }

    const newGraduation = new GraduationMasterModel(inputData)
    await newGraduation.save()

    res.status(201).json({
      success: true,
      message: 'Graduation created successfully',
      data: newGraduation
    })
  } catch (error) {
    console.error('Error creating graduation:', error.message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

const getAllGraduation = async (req, res) => {
  try {
    const graduations = await GraduationMasterModel.find({ delete: false })

    res.status(200).json({
      success: true,
      message: 'Graduations fetched successfully',
      data: graduations
    })
  } catch (error) {
    console.error('Error fetching graduations:', error.message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

const updateGraduation = async (req, res) => {
  try {
    const { id } = req.params
    const { inputData } = req.body
    if (!inputData) {
      return res
        .status(400)
        .json({ success: false, message: 'Graduation field is required' })
    }

    const updatedGraduation = await GraduationMasterModel.findByIdAndUpdate(
      id,
      inputData,
      { new: true }
    )

    if (!updatedGraduation) {
      return res
        .status(404)
        .json({ success: false, message: 'Graduation not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Graduation updated successfully',
      data: updatedGraduation
    })
  } catch (error) {
    console.error('Error updating graduation:', error.message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

const deleteGraduation = async (req, res) => {
  try {
    const { id } = req.params

    const deletedGraduation = await GraduationMasterModel.findByIdAndUpdate(
      id,
      { delete: true },
      { new: true }
    )

    if (!deletedGraduation) {
      return res
        .status(404)
        .json({ success: false, message: 'Graduation not found' })
    }

    res
      .status(200)
      .json({ success: true, message: 'Graduation deleted successfully' })
  } catch (error) {
    console.error('Error deleting graduation:', error.message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Export all controllers
module.exports = {
  createGraduation,
  getAllGraduation,
  updateGraduation,
  deleteGraduation
}
