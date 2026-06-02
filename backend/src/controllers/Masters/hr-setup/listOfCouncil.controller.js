const { ListOfCouncilMasterModel } = require('../../../models'); 

// Create a new council entry
const createCouncil = async (req, res) => {
  try {
    const { inputData } = req.body;

    if (!inputData || !inputData.council) {
      return res
        .status(400)
        .json({ success: false, message: 'Council name is required' });
    }

    const newCouncil = new ListOfCouncilMasterModel(inputData);
    await newCouncil.save();

    res.status(201).json({
      success: true,
      message: 'Council created successfully',
      data: newCouncil,
    });
  } catch (error) {
    console.error('Error creating council:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Fetch all council entries
const getAllCouncils = async (req, res) => {
  try {
    const councils = await ListOfCouncilMasterModel.find({ delete: false });

    res.status(200).json({
      success: true,
      message: 'Councils fetched successfully',
      data: councils,
    });
  } catch (error) {
    console.error('Error fetching councils:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update a specific council entry
const updateCouncil = async (req, res) => {
  try {
    const { id } = req.params;
    const { inputData } = req.body;

    if (!inputData) {
      return res
        .status(400)
        .json({ success: false, message: 'Council name is required' });
    }

    const updatedCouncil = await ListOfCouncilMasterModel.findByIdAndUpdate(
      id,
      inputData,
      { new: true }
    );

    if (!updatedCouncil) {
      return res
        .status(404)
        .json({ success: false, message: 'Council not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Council updated successfully',
      data: updatedCouncil,
    });
  } catch (error) {
    console.error('Error updating council:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Soft delete a specific council entry
const deleteCouncil = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCouncil = await ListOfCouncilMasterModel.findByIdAndUpdate(
      id,
      { delete: true },
      { new: true }
    );

    if (!deletedCouncil) {
      return res
        .status(404)
        .json({ success: false, message: 'Council not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Council deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting council:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const addAllCouncils = async (req, res) => {
  const councils = [
    { council: "Andhra Pradesh Medical Council" },
    { council: "Arunachal Pradesh Medical Council" },
    { council: "Assam Medical Council" },
    { council: "Bihar Medical Council" },
    { council: "Chattisgarh Medical Council" },
    { council: "Delhi Medical Council" },
    { council: "Goa Medical Council" },
    { council: "Gujarat Medical Council" },
    { council: "Haryana Dental & Medical Councils" },
    { council: "Jharkhand Medical Council" },
    { council: "Karnataka Medical Council" },
    { council: "Madhya Pradesh Medical Council" },
    { council: "Maharashtra Medical Council" },
    { council: "Orissa Council of Medical Registration" },
    { council: "Punjab Medical Council" },
    { council: "Rajasthan Medical Council" },
    { council: "Sikkim Medical Council" },
    { council: "Tamil Nadu Medical Council" },
    { council: "Tripura State Medical Council" },
    { council: "Uttar Pradesh Medical Council" },
    { council: "Uttarakhand Medical Council" },
    { council: "West Bengal Medical Council" },
    { council: "Andhra Pradesh Nurses & Midwives Council" },
    { council: "Arunachal Pradesh Nursing Council" },
    { council: "Assam Nurses Midwives & Health Visitor Council" },
    { council: "Bihar Nurses Registration Council" },
    { council: "Chattisgarh Nursing Council" },
    { council: "Delhi Nursing Council" },
    { council: "Goa Nursing Council" },
    { council: "Gujarat Nursing Council" },
    { council: "Haryana Nurses & Nurse-Midwives Council" },
    { council: "Himachal Pradesh Nurses Registration Council" },
    { council: "Jammu and Kashmir State Paramedical & Nursing Council" },
    { council: "Jharkhand Nurses Registration Council" },
    { council: "Karnataka Nursing Council" },
    { council: "Kerala Nurses & Midwives Council" },
    { council: "Madhya Pradesh Nurses Registration Council" },
    { council: "Maharashtra Nursing Council" },
    { council: "Manipur Nursing Council" },
    { council: "Meghalaya Nursing Council" },
    { council: "Mizoram Nursing Council" },
    { council: "Odisha Nurses & Midwives Registration Council" },
    { council: "Punjab Nurses Registration Council" },
    { council: "Rajasthan Nursing Council" },
    { council: "Tamil Nadu Nurses & Midwives Council" },
    { council: "Tripura Nursing Council" },
    { council: "Uttar Pradesh Nurses & Midwives Council" },
    { council: "Uttarakhand Nurses Midwives Council" },
    { council: "West Bengal Nursing Council" },
    { council: "Telangana State Nurses Midwives Auxiliary Nurse Midwives & Health Visitors Council" },
    { council: "Sikkim Nursing Council" },
    { council: "Nagaland Nursing Council" },
    { council: "Maharashtra Paramedical Council" }
  ];

  try {
    // Insert councils into the database
    const result = await ListOfCouncilMasterModel.insertMany(councils);

    return res.status(201).json({
      message: 'All councils added successfully!',
      count: result.length,
      data: result
    });
  } catch (error) {
    console.error('Error adding councils:', error);

    return res.status(500).json({
      message: 'Failed to add councils.',
      error: error.message
    });
  }
};




module.exports = {
  createCouncil,
  getAllCouncils,
  updateCouncil,
  deleteCouncil,
  addAllCouncils
};
