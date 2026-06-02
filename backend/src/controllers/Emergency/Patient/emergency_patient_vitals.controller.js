const { EmergencyPatientVitalsModel } = require("../../../models");

const createEmergencyPatientVitalsController = async (req, res) => {
    try {
        const newVitals = new EmergencyPatientVitalsModel({ ...req.body });
        const savedVitals = await newVitals.save();
        
        res.status(201).json({
            msg: "Emergency Patient Vitals created successfully",
            data: savedVitals
        });
    } catch (error) {
        console.error("Error creating Emergency Patient Vitals:", error.message);
        res.status(500).json({
            msg: "Failed to create Emergency Patient Vitals",
            error: error.message
        });
    }
};



const getEmergencyPatientVitalsController = async (req, res) => {
    try {
        const { id } = req.params; //this is patientId which is objectId of emergencyRegistration table
        const emergencyPatientVitals = await EmergencyPatientVitalsModel.find({patientId : id});
        res.status(200).json({msg : "Emergency Patient Details Found", data : emergencyPatientVitals});
       
    } catch (error) {
        console.error("Error fetching Emergency Patient Vitals:", error.message);
        res.status(500).json({
            msg: "Failed to fetch Emergency Patient Vitals",
            error: error.message
        });
    }
};

const updateEmergencyPatientVitalsController = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = await EmergencyPatientVitalsModel.findByIdAndUpdate(id, { ...req.body }, { new: true });

        if (!updatedData) {
            return res.status(404).json({ msg: "Vitals data not found" });
        }

        res.status(200).json({
            msg: "Emergency Patient Vitals updated successfully",
            data: updatedData
        });
    } catch (error) {
        console.error("Error updating Emergency Patient Vitals:", error.message);
        res.status(500).json({
            msg: "Failed to update Emergency Patient Vitals",
            error: error.message
        });
    }
};

module.exports = {
    createEmergencyPatientVitalsController,
    getEmergencyPatientVitalsController,
    updateEmergencyPatientVitalsController
};
