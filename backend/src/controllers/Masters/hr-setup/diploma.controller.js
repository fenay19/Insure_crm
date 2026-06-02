const { DiplomaMasterModel } = require('../../../models')

//create a new diploma entry

const createDiploma = async (req, res) => {
  try {
    const { inputData } = req.body

    if (!inputData || !inputData.diploma) {
      return res.status(400).json({
        success: false,
        message: 'Diploma field is required'
      })
    }

    const newDiploma = new DiplomaMasterModel(inputData)
    await newDiploma.save()

    res.status(201).json({
      success: true,
      message: 'Diploma created successfully',
      data: newDiploma
    })
  } catch (error) {
    console.error('Error creating Diploma:', error.message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}


const getAllDiploma = async (req, res) => {
  try {
    const diplomas = await DiplomaMasterModel.find({delete : false});
    res.status(200).json({
      success : true,
      message : 'Diplomas fetched successfully',
      data : diplomas
    })
  } catch (error) {
    console.error('Error fetching diplomas:', error.message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

const updateDiploma = async (req, res) => {
  try {
    const { id } = req.params
    const { inputData } = req.body
    if (!inputData) {
      return res
        .status(400)
        .json({ success: false, message: 'Diploma field is required' })
    }

    const updateDiploma = await DiplomaMasterModel.findByIdAndUpdate(
      id,
      inputData,
      { new: true }
    )

    if (!updateDiploma) {
      return res
        .status(404)
        .json({ success: false, message: 'Diploma not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Diploma updated successfully',
      data: updateDiploma
    })
  } catch (error) {
    console.error('Error updating diploma:', error.message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

const deleteDiploma = async (req,res) => {
  try {
    const {id} = req.params;

    const deleteDiploma = await DiplomaMasterModel.findByIdAndUpdate(
      id,
      {delete : true},
      {new : true}
    )

    if(!deleteDiploma) {
      return res.status(404).json({
        success : false,
        message : 'Diploma not found'
      })
    }

    res.status(200).json({success : true, message : 'Diploma deleted successfully'})
  } catch (error) {
    console.error('Error deleting diploma:', error.message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

module.exports = {
  createDiploma,
  getAllDiploma,
  updateDiploma,
  deleteDiploma
}
