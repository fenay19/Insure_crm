const TreatmentSheet = require('../../models/Masters/ipd-form-setup/treatmentSheet.model');

const getTreatmentSheet=async(req,res)=>{
      try {
        const sheets = await TreatmentSheet.find();
        res.status(200).json(sheets);
      } catch (error) {
        console.error('Error fetching treatment sheets:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}
const createTreatmentSheet=async(req,res)=>{
      try {
        const newTemplateSheet = new TreatmentSheet(req.body);
        await newTemplateSheet.save();
        res.status(201).json({ message: 'Treatment Sheet saved successfully' });
      } catch (error) {
        console.error('Error saving treatment sheet:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}

const updateTreatmentSheet = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const { fileName, sectionContents } = req.body;
    try {
        const updated = await Treatment.findByIdAndUpdate(
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

const deleteTreatmentSheet = async (req, res) => {
    try {
        const { id } = req.params;
        await Form.findByIdAndDelete(id);
        res.status(200).json({ message: 'Deleted successfully' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}
module.exports={getTreatmentSheet,
    createTreatmentSheet,
    updateTreatmentSheet,
    deleteTreatmentSheet
}
