const File = require("../../models/Masters/Template/file.model.js");

const CreateTemplateRadiologyController = async (req, res) => {
  try {
    const { fileName, sectionContents } = req.body;
    const newFile = new File({
      fileName,
      sectionContents
    });
    await newFile.save();
    res.status(201).json({ message: 'File saved successfully', file: newFile });
  } catch (error) {
    console.error('Error in CreateTemplateRadiologyController:', error);
    res.status(500).json({ error: 'Failed to save file' });
  }
};
const GetTemplateRadiologyController = async (req, res) => {
  try {
    const files = await File.find(); 
    res.status(200).json(files);
  } catch (error) {
    console.error('Error in GetTemplateRadiologyController:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};
const updateTemplateRadiologyController= async (req, res) => {
  const { id } = req.params;
  console.log(req.body)
  const { fileName,sectionContents} = req.body;
  try {
    const updated = await File.findByIdAndUpdate(
      id,
      { fileName, sectionContents },
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
const deleteTemplateRadiologyController= async (req, res) => {
  try {
    const { id } = req.params;
    await File.findByIdAndDelete(id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  CreateTemplateRadiologyController,
  GetTemplateRadiologyController,
  updateTemplateRadiologyController,
  deleteTemplateRadiologyController
};
