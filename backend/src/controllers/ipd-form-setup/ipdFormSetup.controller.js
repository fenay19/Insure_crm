const Form = require('../../models/Masters/ipd-form-setup/ipdFormSetup.model')


const getIpdFormSetupController = async (req, res) => {
    try {
        const files = await Form.find();
        res.status(200).json(files);
    } catch (error) {
        console.error('Error in getIpdFormSetupController:', error);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
}

const createIpdFormSetupController = async (req, res) => {
    try {
        const { fileName, sectionContents } = req.body;
        const newForm = new Form({
            fileName,
            sectionContents
        });
        await newForm.save();
        res.status(201).json({ message: 'File saved successfully', fileData: newForm });
    } catch (error) {
        console.error('Error in createIpdFormSetupController:', error);
        res.status(500).json({ error: 'Failed to save file' });
    }
}

const updateIpdFormController = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const { fileName, sectionContents } = req.body;
    try {
        const updated = await Form.findByIdAndUpdate(
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
}

const deleteIpdFormSetupController = async (req, res) => {
    try {
        const { id } = req.params;
        await Form.findByIdAndDelete(id);
        res.status(200).json({ message: 'Deleted successfully' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}



module.exports = {
    getIpdFormSetupController,
    createIpdFormSetupController,
    updateIpdFormController,
    deleteIpdFormSetupController
}