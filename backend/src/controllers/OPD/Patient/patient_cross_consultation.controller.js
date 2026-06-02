const mongoose = require("mongoose");
const PatientCrossConsultationModel = require("../../../models/OPD/Patient/patient_cross_consultation.model");
const OpdPatientModel = require("../../../models/appointment-confirm/opdPatient.model");

// Create
const createPatientCrossConsultation = async (req, res) => {
  try {
    const {
      patientId,
      departmentId,
      consultantId,
      opdPatientId,
      notes,
      consultant,
    } = req.body;

    const patientCrossConsultation = new PatientCrossConsultationModel({
      patientId: new mongoose.Types.ObjectId(patientId),
      departmentId: new mongoose.Types.ObjectId(departmentId),
      consultantId: new mongoose.Types.ObjectId(consultantId),
      opdPatientId: new mongoose.Types.ObjectId(opdPatientId),
      notes: notes,
      consultant: Array.isArray(consultant)
        ? consultant.map((id) => new mongoose.Types.ObjectId(id))
        : [new mongoose.Types.ObjectId(consultant)],
    });

    const saved = await patientCrossConsultation.save();
    await OpdPatientModel.findOneAndUpdate(
      { patientId: patientId },
      {
        $set: {
          "requests.crossConsultant": saved?._id,
        },
      },
      { new: true }
    );
    res.status(200).json({
      message: "Cross consultation saved successfully",
      data: saved,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Edit (Add Consultant)
const editPatientCrossConsultation = async (req, res) => {
  try {
    const { consultant } = req.body;
    const { id } = req.params;

    const document = await PatientCrossConsultationModel.findById(id);

    if (!document) {
      return res.status(400).json({
        message: "No consultant record exists",
      });
    }

    const consultantId = new mongoose.Types.ObjectId(consultant);

    const alreadyExists = document.consultant.some((existing) =>
      existing.equals(consultantId)
    );

    if (alreadyExists) {
      return res.status(200).json({
        message: "Consultant already exists",
        data: document,
      });
    }

    document.consultant.push(consultantId);
    await document.save();

    res.status(200).json({
      message: "Consultant added successfully",
      data: document,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get
const getPatientCrossConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "ID not provided",
      });
    }

    const document = await PatientCrossConsultationModel.findOne({
      patientId: id,
    }).populate({
      path: "consultant",
      populate: {
        path: "employmentDetails.departmentOrSpeciality",
        model: "DepartmentSetup", // use the actual model name
      },
    });
    if (!document) {
      return res.status(400).json({
        message: "Cross consultation not found",
      });
    }

    res.status(200).json({
      message: "Cross consultation fetched successfully",
      data: document,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Delete Consultant from Array
const deletePatientCrossConsultation = async (req, res) => {
  try {
    const { consultant } = req.body;
    const { id } = req.params;

    const document = await PatientCrossConsultationModel.findById(id);

    if (!document) {
      return res.status(400).json({
        message: "No consultant record exists",
      });
    }

    const consultantId = new mongoose.Types.ObjectId(consultant);

    const updated = document.consultant.filter(
      (existing) => !existing.equals(consultantId)
    );

    if (updated.length === document.consultant.length) {
      return res.status(404).json({
        message: "Consultant not found in the list",
      });
    }

    document.consultant = updated;
    await document.save();

    res.status(200).json({
      message: "Consultant removed successfully",
      data: document,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Export
module.exports = {
  createPatientCrossConsultation,
  editPatientCrossConsultation,
  getPatientCrossConsultation,
  deletePatientCrossConsultation,
};
