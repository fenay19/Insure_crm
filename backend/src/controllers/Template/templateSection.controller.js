const Section = require("../../models/Masters/Template/templateSection.model");

const CreateTemplateSectionController = async (req, res) => {
  try {
    const {section} = req.body;
    const newFile = new Section({
      section
    });
    await newFile.save();
    res.status(201).json({ message: 'aved successfully', file: newFile });
  } catch (error) {
    console.error('Error in CreateTemplateSectionController:', error);
    res.status(500).json({ error: 'Failed to save file' });
  }
};
const GetTemplateSectionController = async (req, res) => {
  try {
    const files = await Section.find(); 
    res.status(200).json(files);
  } catch (error) {
    console.error('Error in GetTemplateRadiologyController:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};
const updateTemplateSectionController= async (req, res) => {
  const { id } = req.params;
  console.log(req.body)
  const {section} = req.body;
  try {
    const updated = await Section.findByIdAndUpdate(
      id,
      {section},
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const deleteTemplateSectionController= async (req, res) => {
  try {
    const { id } = req.params;
    await Section.findByIdAndDelete(id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  CreateTemplateSectionController,
  GetTemplateSectionController,
  updateTemplateSectionController,
  deleteTemplateSectionController
};
