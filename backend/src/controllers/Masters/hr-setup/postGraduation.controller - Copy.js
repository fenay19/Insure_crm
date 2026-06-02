const { PostGraduationMasterModel } = require('../../../models'); 

// Create a new post-graduation entry
const createPostGraduation = async (req, res) => {
  try {
    const { inputData } = req.body;

    if (!inputData || !inputData.postGraduation) {
      return res
        .status(400)
        .json({ success: false, message: 'Post-graduation field is required' });
    }

    const newPostGraduation = new PostGraduationMasterModel(inputData);
    await newPostGraduation.save();

    res.status(201).json({
      success: true,
      message: 'Post-graduation created successfully',
      data: newPostGraduation,
    });
  } catch (error) {
    console.error('Error creating post-graduation:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Fetch all post-graduation entries
const getAllPostGraduation = async (req, res) => {
  try {
    const postGraduations = await PostGraduationMasterModel.find({ delete: false });

    res.status(200).json({
      success: true,
      message: 'Post-graduations fetched successfully',
      data: postGraduations,
    });
  } catch (error) {
    console.error('Error fetching post-graduations:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update a specific post-graduation entry
const updatePostGraduation = async (req, res) => {
  try {
    const { id } = req.params;
    const { inputData } = req.body;

    if (!inputData) {
      return res
        .status(400)
        .json({ success: false, message: 'Post-graduation field is required' });
    }

    const updatedPostGraduation = await PostGraduationMasterModel.findByIdAndUpdate(
      id,
      inputData,
      { new: true }
    );

    if (!updatedPostGraduation) {
      return res
        .status(404)
        .json({ success: false, message: 'Post-graduation not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Post-graduation updated successfully',
      data: updatedPostGraduation,
    });
  } catch (error) {
    console.error('Error updating post-graduation:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Soft delete a specific post-graduation entry
const deletePostGraduation = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPostGraduation = await PostGraduationMasterModel.findByIdAndUpdate(
      id,
      { delete: true },
      { new: true }
    );

    if (!deletedPostGraduation) {
      return res
        .status(404)
        .json({ success: false, message: 'Post-graduation not found' });
    }

    res
      .status(200)
      .json({ success: true, message: 'Post-graduation deleted successfully' });
  } catch (error) {
    console.error('Error deleting post-graduation:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Export all controllers
module.exports = {
  createPostGraduation,
  getAllPostGraduation,
  updatePostGraduation,
  deletePostGraduation,
};
