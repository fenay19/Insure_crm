const OtherAllowancesModel = require('../../../models/Masters/hr-setup/otherAllowances.model')


const createOtherAllowances = async (req, res) => {
    try {
    
      const {OtherAllowances} = req.body
      console.log(req.body);
      if (!OtherAllowances && OtherAllowances !== 0) {
        return res.status(400).json({
          success: false,
          message: 'OtherAllowances field is required'
        })
      }
      const newOtherAllowances = new OtherAllowancesModel({OtherAllowances} )
      await newOtherAllowances.save()
      res.status(201).json({
        success: true,
        message: 'OtherAllowances created successfully',
        data: OtherAllowances
      })
    } catch (error) {
      console.error('Error creating Other Allowances:', error.message)
      res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const getOtherAllowances = async (req, res) => {
  try {
    const allowances = await OtherAllowancesModel.find({
      delete: false
    }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      message: 'OtherAllowances fetched successfully',
      data: allowances
    })
  } catch (error) {
    console.error('Error fetching Other Allowances:', error.message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
const updateOtherAllowances= async (req, res) => {
  try {
    const { id } = req.params
    const {OtherAllowances} = req.body

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID is required'
      })
    }

    if (!OtherAllowances && OtherAllowances!== 0) {
      return res.status(400).json({
        success: false,
        message: 'OtherAllowance field is required'
      })
    }

    const updatedOtherAllowances = await OtherAllowancesModel.findByIdAndUpdate(
      id,
      { OtherAllowances},
      { new: true, runValidators: true }
    )
    if (!updatedOtherAllowances) {
      return res.status(404).json({
        success: false,
        message: 'Other Allowances not found'
      })
    }
    res.status(200).json({
      success: true,
      message: 'Other Allowances updated successfully',
      data: updatedOtherAllowances
    })
  } catch (error) {
    console.error('Error updating Other Allowances', error.message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
const deleteOtherAllowances = async (req, res) => {  
  try {
    const {id} = req.params
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID is required'
      })
    }
    const deletedOtherAllowances= await OtherAllowancesModel.findByIdAndUpdate(
      id,
      { delete: true },
      { new: true }
    )
    if (!deletedOtherAllowances) {
      return res.status(404).json({
        success: false,
        message: 'OtherAllowances not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'OtherAllowances deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting OtherAllowances:', error.message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
module.exports = {
  createOtherAllowances,
  getOtherAllowances,
  updateOtherAllowances,
  deleteOtherAllowances
}
