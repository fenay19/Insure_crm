const { SuperSpecializationMasterModel } = require('../../../models'); 


const createSuperSpecialization = async (req, res) => {
  try {
    const { inputData } = req.body;

    if (!inputData || !inputData.superSpecialization) {
      return res
        .status(400)
        .json({ success: false, message: 'Super-specialization field is required' });
    }

    const newSuperSpecialization = new SuperSpecializationMasterModel(inputData);
    await newSuperSpecialization.save();

    res.status(201).json({
      success: true,
      message: 'Super-specialization created successfully',
      data: newSuperSpecialization,
    });
  } catch (error) {
    console.error('Error creating super-specialization:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const getAllSuperSpecialization = async (req, res) => {
  try {
    const superSpecializations = await SuperSpecializationMasterModel.find({ delete: false });

    res.status(200).json({
      success: true,
      message: 'Super-specializations fetched successfully',
      data: superSpecializations,
    });
  } catch (error) {
    console.error('Error fetching super-specializations:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const updateSuperSpecialization = async (req, res) => {
  try {
    const { id } = req.params;
    const { inputData } = req.body;

    if (!inputData) {
      return res
        .status(400)
        .json({ success: false, message: 'Super-specialization field is required' });
    }

    const updatedSuperSpecialization = await SuperSpecializationMasterModel.findByIdAndUpdate(
      id,
      inputData,
      { new: true }
    );

    if (!updatedSuperSpecialization) {
      return res
        .status(404)
        .json({ success: false, message: 'Super-specialization not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Super-specialization updated successfully',
      data: updatedSuperSpecialization,
    });
  } catch (error) {
    console.error('Error updating super-specialization:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const deleteSuperSpecialization = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSuperSpecialization = await SuperSpecializationMasterModel.findByIdAndUpdate(
      id,
      { delete: true },
      { new: true }
    );

    if (!deletedSuperSpecialization) {
      return res
        .status(404)
        .json({ success: false, message: 'Super-specialization not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Super-specialization deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting super-specialization:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


module.exports = {
  createSuperSpecialization,
  getAllSuperSpecialization,
  updateSuperSpecialization,
  deleteSuperSpecialization,
};
