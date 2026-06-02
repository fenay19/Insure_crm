const PatientVital = require("../../../models/Masters/formSetup/formSetupVitalMaster.modal");

// // Save vital data to the database
// const addVitals = async (req, res) => {
//   try {
//     const {
//       heading,
//       parameters,
//       selectedCheckboxes,
//       selectedChips,
//       selectedRange,
//       departmentId,
//       patientId,
//       consultantId,
//       inputData,
//     } = req.body;

//     const normalizedHeading = heading.toLowerCase().trim();

//     // Define a mapping of units based on the heading
//     const unitMap = {
//       "respiratory rate (rr)": "per min",
//       "pulse (radial)/heart rate": "per min",
//       height: "cm",
//       weight: "kg",
//       "blood pressure (bp)": "mm Hg",
//       "body mass index (bmi)": "kg/m2 ",
//     };

//     const unit =
//       unitMap[normalizedHeading] ||
//       (normalizedHeading === "blood oxygen saturation (spo2)" ? ` %` : "");

//     // Check if the vital data already exists for this patient
//     // const existingVital = await VitalData.findOne({
//     //   heading,
//     //   patientId,
//     // });

//     // if (existingVital) {
//     //   return res
//     //     .status(400)
//     //     .json({ message: "Vital data already exists for this patient." });
//     // }

//     // Save new vital data
//     const vitalData = await VitalData.create({
//       heading,
//       parameters,
//       selectedChips,
//       selectedCheckboxes,
//       selectedRange,
//       departmentId,
//       patientId,
//       consultantId,
//       inputVal: inputData,
//       unit,
//     });

//     res
//       .status(201)
//       .json({ message: "Vital data saved successfully", data: vitalData });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error saving vital data",
//       error: error.message || "Unknown error",
//     });
//   }
// };

// // Get all saved vital data
// const getAllVitals = async (req, res) => {
//   try {
//     const vitalData = await VitalData.find();
//     res.status(200).json(vitalData);
//   } catch (error) {
//     res
//       .status(400)
//       .json({ message: "Error fetching vital data", error: error.message });
//   }
// };

// const getVitalsByPatient = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const vitalData = await VitalData.find({ patientId: id });
//     res.status(200).json(vitalData);
//   } catch (error) {
//     res
//       .status(400)
//       .json({ message: "Error fetching vital data", error: error.message });
//   }
// };

// const deletePatientVitals = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       res.status(404).json({ message: "ID is not defined" });
//     }

//     await VitalData.findByIdAndDelete(id);
//     return res
//       .status(200)
//       .json({ message: "Patient Vital Deleted Successfully", status: true });
//   } catch (err) {
//     res
//       .status(400)
//       .json({ message: "Error deleting vital data", error: err.message });
//   }
// };

// const updateVitals = async (req, res) => {
//   try {
//     const { id } = req.params; // Get patientId from request params
//     const {
//       heading,
//       parameters,
//       selectedCheckboxes,
//       selectedChips,
//       selectedRange,
//       departmentId,
//       consultantId,
//       inputData,
//     } = req.body;

//     const normalizedHeading = heading.toLowerCase().trim();

//     // Define a mapping of units based on the heading
//     const unitMap = {
//       "respiratory rate (rr)": "per min",
//       "pulse (radial)/heart rate": "per min",
//       height: "cm",
//       weight: "kg",
//       "blood pressure (bp)": "mm Hg",
//       "body mass index (bmi)": "kg/m2 ",
//     };

//     const unit =
//       unitMap[normalizedHeading] ||
//       (normalizedHeading === "blood oxygen saturation (spo2)" ? ` %` : "");

//     // Find the existing vital record for the patient
//     const existingVital = await VitalData.findById(id);

//     if (!existingVital) {
//       return res
//         .status(404)
//         .json({ message: "Vital data not found for this patient." });
//     }

//     // Update the existing vital data
//     existingVital.parameters = parameters || existingVital.parameters;
//     existingVital.selectedCheckboxes =
//       selectedCheckboxes || existingVital.selectedCheckboxes;
//     existingVital.selectedChips = selectedChips || existingVital.selectedChips;
//     existingVital.selectedRange = selectedRange || existingVital.selectedRange;
//     existingVital.departmentId = departmentId || existingVital.departmentId;
//     existingVital.consultantId = consultantId || existingVital.consultantId;
//     existingVital.inputVal = inputData || existingVital.inputVal;
//     existingVital.unit = unit;

//     // Save the updated data
//     await existingVital.save();

//     res.status(200).json({
//       message: "Vital data updated successfully",
//       data: existingVital,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error updating vital data",
//       error: error.message || "Unknown error",
//     });
//   }
// };

// module.s = {
//   getAllVitals,
//   addVitals,
//   getVitalsByPatient,
//   deletePatientVitals,
//   updateVitals,
// };

// Create a new patient vital record
const createPatientVital = async (req, res) => {
  try {
    const newVital = new PatientVital(req.body);

    await newVital.save();
    res.status(201).json({
      message: "Patient vital record created successfully",
      data: newVital,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating patient vital record", error });
  }
};

// Get all patient vital records
const getAllPatientVitals = async (req, res) => {
  try {
    const vitals = await PatientVital.find();
    res.status(200).json(vitals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient vitals", error });
  }
};

// Get a single patient's vital records by patientId
const getPatientVitalById = async (req, res) => {
  try {
    const { patientId } = req.params;
    const vital = await PatientVital.findOne({ patientId });

    if (!vital) {
      return res
        .status(404)
        .json({ message: "Patient vital record not found" });
    }

    res.status(200).json({ data: vital });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching patient vital record", error });
  }
};

// Update a patient's vital records
const updatePatientVital = async (req, res) => {
  try {
    const { patientId } = req.params;
    const updatedData = req.body;

    const updatedVital = await PatientVital.findOneAndUpdate(
      { patientId },
      updatedData,
      { new: true }
    );

    if (!updatedVital) {
      return res
        .status(404)
        .json({ message: "Patient vital record not found" });
    }

    res.status(200).json({
      message: "Patient vital record updated successfully",
      data: updatedVital,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating patient vital record", error });
  }
};

const updateSingleEntries = async (req, res) => {
  try {
    const { patientId, vitalId } = req.params; // Get patientId and vitalId from URL params
    const updatedData = req.body; // Data to update
    console.log(patientId, vitalId);
    console.log(updatedData);

    if (!vitalId || !patientId) {
      return res
        .status(400)
        .json({ message: "Patient ID and Vital ID are required" });
    }

    // Find the patient record first
    const patientVital = await PatientVital.findOne({ patientId });

    if (!patientVital) {
      return res
        .status(404)
        .json({ message: "Patient vital record not found" });
    }

    // List of vital fields to check
    const vitalFields = [
      "respiratoryRate",
      "pulseRate",
      "height",
      "weight",
      "bodyMassIndex",
      "bloodPressure",
      "temperature",
      "bloodOxygenSaturation",
    ];

    let foundField = null;

    // Find which array contains the vitalId
    for (let field of vitalFields) {
      if (
        patientVital[field]?.some((entry) => entry._id.toString() === vitalId)
      ) {
        foundField = field;
        break;
      }
    }

    if (!foundField) {
      return res.status(404).json({ message: "Vital entry not found" });
    }

    // Use $set with positional operator ($) to update the specific entry
    const updatedVital = await PatientVital.findOneAndUpdate(
      { patientId, [`${foundField}._id`]: vitalId }, // Match patientId & vitalId inside array
      { $set: { [`${foundField}.$`]: updatedData } }, // Update only the matched entry
      { new: true }
    );

    res.status(200).json({
      message: "Patient vital record updated successfully",
      data: updatedVital,
      status: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating patient vital record", error });
  }
};

// Delete a patient's vital record
const deletePatientVital = async (req, res) => {
  try {
    const { patientId, vitalId } = req.params; // Get patientId and vitalId from URL params

    if (!vitalId) {
      return res
        .status(400)
        .json({ message: "Patient ID and Vital ID are required" });
    }

    // Find the patient record first
    const patientVital = await PatientVital.findOne({ patientId });

    if (!patientVital) {
      return res
        .status(404)
        .json({ message: "Patient vital record not found" });
    }

    // List of vital fields to check
    const vitalFields = [
      "respiratoryRate",
      "pulseRate",
      "height",
      "weight",
      "bodyMassIndex",
      "bloodPressure",
      "temperature",
      "bloodOxygenSaturation",
    ];

    let foundField = null;

    // Find which array contains the vitalId
    for (let field of vitalFields) {
      if (
        patientVital[field]?.some((entry) => entry._id.toString() === vitalId)
      ) {
        foundField = field;
        break;
      }
    }

    if (!foundField) {
      return res.status(404).json({ message: "Vital entry not found" });
    }

    // Use $pull to remove the specific entry from the found field
    const updatedVital = await PatientVital.findOneAndUpdate(
      { patientId },
      { $pull: { [foundField]: { _id: vitalId } } },
      { new: true }
    );

    res.status(200).json({
      message: `Vital entry deleted successfully from ${foundField}`,
      updatedVital,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting patient vital entry",
      error: error.message,
    });
  }
};

module.exports = {
  createPatientVital,
  getAllPatientVitals,
  deletePatientVital,
  updatePatientVital,
  getPatientVitalById,
  updateSingleEntries,
};
