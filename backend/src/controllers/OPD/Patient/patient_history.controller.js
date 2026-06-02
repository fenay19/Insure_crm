const mongoose = require("mongoose");
const httpStatus = require("http-status");
const {
  MedicalProblemModel,
  DrugHistoryModel,
  DrugAllergyModel,
  GeneralAllergyModel,
  LifeStyleModel,
  ProcedureModel,
  FoodAllergyModel,
  GynacHistoryModel,
  ObstetricHistoryModel,
  NutritionalHistoryModel,
  PediatricHistoryModel,
  PatientHistroyModel,
} = require("../../../models");
const DepartHistroyModel = require("../../../models/OPD/depFormSetup/medicalHistory.modal");

const updateCounts = (items, historyItems, fieldName = "count") => {
  items.forEach((item) => {
    const matchingItem = historyItems.find(
      (h) => h._id === item._id.toString()
    );
    if (matchingItem) {
      item[fieldName] = (item[fieldName] || 0) + 1;
    }
  });
};

const createPatientHistory = async (req, res) => {
  try {
    const newPatientHistory = new PatientHistroyModel({ ...req.body });
    const medicalProblemIds = newPatientHistory.medicalProblems.map(
      (problem) => problem._id
    );
    const drugHistoryIds = newPatientHistory.drugHistory.map(
      (drug) => drug._id
    );
    const generalAllergyIds = newPatientHistory.allergies.which.general.map(
      (genallergy) => genallergy._id
    );
    const foodAllergyIds = newPatientHistory.allergies.which.food.map(
      (foodallergy) => foodallergy._id
    );
    const durgAllergyIds = newPatientHistory.allergies.which.drug.map(
      (drugallergy) => drugallergy._id
    );
    const familyMemberIds = newPatientHistory.familyHistory.map(
      (family) => family._id
    );
    const lifeStyleIds = newPatientHistory.lifeStyle.map((life) => life._id);
    const gynacHistoryIds = newPatientHistory.gynac.map((gynac) => gynac._id);
    const obstretricHistoryIds = newPatientHistory.obstetric.map(
      (obstetric) => obstetric._id
    );
    const nutritionalHistoryIds = newPatientHistory.nutritional.map(
      (nutritional) => nutritional._id
    );
    const pediatricHistoryIds = newPatientHistory.pediatric.map(
      (pediatric) => pediatric._id
    );
    const procedureIds = newPatientHistory.procedure.which.map(
      (procedure) => procedure._id
    );

    const medicalProblems = await MedicalProblemModel.find({
      _id: { $in: medicalProblemIds },
    });
    const drugHistory = await DrugHistoryModel.find({
      _id: { $in: drugHistoryIds },
    });
    const generalAllergy = await GeneralAllergyModel.find({
      _id: { $in: generalAllergyIds },
    });
    const foodAllergy = await FoodAllergyModel.find({
      _id: { $in: foodAllergyIds },
    });
    const durgAllergy = await DrugAllergyModel.find({
      _id: { $in: durgAllergyIds },
    });
    const familyMember = await MedicalProblemModel.find({
      _id: { $in: familyMemberIds },
    });
    const lifeStyle = await LifeStyleModel.find({
      _id: { $in: lifeStyleIds },
    });
    const gynacHistory = await GynacHistoryModel.find({
      _id: { $in: gynacHistoryIds },
    });
    const obstetricHistory = await ObstetricHistoryModel.find({
      _id: { $in: obstretricHistoryIds },
    });
    const nutritionalHistory = await NutritionalHistoryModel.find({
      _id: { $in: nutritionalHistoryIds },
    });
    const pediatricHistory = await PediatricHistoryModel.find({
      _id: { $in: pediatricHistoryIds },
    });
    const procedure = await ProcedureModel.find({
      _id: { $in: procedureIds },
    });

    // medical problem medicalCount
    medicalProblems.forEach((problem) => {
      const matchingProblem = newPatientHistory.medicalProblems.find(
        (p) => p._id === problem._id.toString()
      );
      if (matchingProblem) {
        problem.medicalCount = (problem.medicalCount || 0) + 1;
      }
    });

    // Drug history drugCount
    drugHistory.forEach((drug) => {
      const matchingdrug = newPatientHistory.drugHistory.find(
        (d) => d._id === drug._id.toString()
      );
      if (matchingdrug) {
        drug.count = (drug.count || 0) + 1;
      }
    });
    // general allergy count
    generalAllergy.forEach((problem) => {
      const generalAllergy = newPatientHistory.allergies.which.general.find(
        (p) => p._id === problem._id.toString()
      );
      if (generalAllergy) {
        problem.count = (problem.count || 0) + 1;
      }
    });
    // food allergy count
    foodAllergy.forEach((problem) => {
      const foodAllergy = newPatientHistory.allergies.which.food.find(
        (p) => p._id === problem._id.toString()
      );
      if (foodAllergy) {
        problem.count = (problem.count || 0) + 1;
      }
    });
    // drug allergy count
    durgAllergy.forEach((problem) => {
      const durgAllergy = newPatientHistory.allergies.which.drug.find(
        (p) => p._id === problem._id.toString()
      );
      if (durgAllergy) {
        problem.count = (problem.count || 0) + 1;
      }
    });
    // medical problem familyCount
    familyMember.forEach((problem) => {
      const familyMember = newPatientHistory.familyHistory.find(
        (p) => p._id === problem._id.toString()
      );
      if (familyMember) {
        problem.familyCount = (problem.familyCount || 0) + 1;
      }
    });

    // life Style count
    lifeStyle.forEach((problem) => {
      const lifeStyle = newPatientHistory.lifeStyle.find(
        (p) => p._id === problem._id.toString()
      );
      if (lifeStyle) {
        problem.count = (problem.count || 0) + 1;
      }
    });
    // Gynac history count
    gynacHistory.forEach((problem) => {
      const GynacHistory = newPatientHistory.gynac.find(
        (p) => p._id === problem._id.toString()
      );
      if (GynacHistory) {
        problem.count = (problem.count || 0) + 1;
      }
    });

    // obstetric  History
    obstetricHistory.forEach((problem) => {
      const obstetricHistory = newPatientHistory.obstretric.find(
        (p) => p._id === problem._id.toString()
      );
      if (obstetricHistory) {
        problem.count = (problem.count || 0) + 1;
      }
    });

    // Nutritional history count
    nutritionalHistory.forEach((problem) => {
      const nutritional = newPatientHistory.nutritional.find(
        (p) => p._id === problem._id.toString()
      );
      if (nutritional) {
        problem.count = (problem.count || 0) + 1;
      }
    });
    // Pediatric history count
    pediatricHistory.forEach((problem) => {
      const pediatric = newPatientHistory.pediatric.find(
        (p) => p._id === problem._id.toString()
      );
      if (pediatric) {
        problem.count = (problem.count || 0) + 1;
      }
    });
    // procedure count
    procedure.forEach((problem) => {
      const procedure = newPatientHistory.procedure.which.find(
        (p) => p._id === problem._id.toString()
      );
      if (procedure) {
        problem.count = (problem.count || 0) + 1;
      }
    });

    await Promise.all([
      medicalProblems.map((problem) => problem.save()),
      drugHistory.map((problem) => problem.save()),
      generalAllergy.map((problem) => problem.save()),
      foodAllergy.map((problem) => problem.save()),
      durgAllergy.map((problem) => problem.save()),
      familyMember.map((problem) => problem.save()),
      lifeStyle.map((problem) => problem.save()),
      gynacHistory.map((problem) => problem.save()),
      obstetricHistory.map((problem) => problem.save()),
      nutritionalHistory.map((problem) => problem.save()),
      pediatricHistory.map((problem) => problem.save()),
      procedure.map((problem) => problem.save()),
    ]);

    // Save the new patient history
    const savePatientHistory = await newPatientHistory.save();

    res.status(httpStatus.CREATED).json({
      msg: "Patient History Stored Successfully",
      data: savePatientHistory,
    });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updatePatientHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const PatientHistory = await PatientHistroyModel.findById(id);
    const medicalProblemIds = PatientHistory?.medicalProblems.map(
      (problem) => problem._id
    );
    const drugHistoryIds = PatientHistory?.drugHistory.map((drug) => drug._id);
    const generalAllergyIds = PatientHistory?.allergies.which.general.map(
      (genallergy) => genallergy._id
    );
    const durgAllergyIds = PatientHistory?.allergies.which.drug.map(
      (drugallergy) => drugallergy._id
    );
    const familyMemberIds = PatientHistory?.familyHistory.map(
      (family) => family._id
    );
    const lifeStyleIds = PatientHistory?.lifeStyle.map((life) => life._id);
    const procedureIds = PatientHistory?.procedure.which.map(
      (procedure) => procedure._id
    );

    const medicalProblems = await MedicalProblemModel.find({
      _id: { $in: medicalProblemIds },
    });
    const drugHistory = await DrugHistoryModel.find({
      _id: { $in: drugHistoryIds },
    });
    const generalAllergy = await GeneralAllergyModel.find({
      _id: { $in: generalAllergyIds },
    });
    const durgAllergy = await DrugAllergyModel.find({
      _id: { $in: durgAllergyIds },
    });
    const familyMember = await MedicalProblemModel.find({
      _id: { $in: familyMemberIds },
    });
    const lifeStyle = await LifeStyleModel.find({ _id: { $in: lifeStyleIds } });
    const procedure = await ProcedureModel.find({ _id: { $in: procedureIds } });

    medicalProblems.forEach((problem) => {
      const matchingProblem = PatientHistory?.medicalProblems.find(
        (p) => p._id === problem._id.toString()
      );
      if (matchingProblem) {
        problem.medicalCount = (problem.medicalCount || 0) + 1;
      }
    });
    // Drug History Count
    drugHistory.forEach((drug) => {
      const matchingdrug = PatientHistory?.drugHistory.find(
        (d) => d._id === drug._id.toString()
      );
      if (matchingdrug) {
        drug.count = (drug.count || 0) + 1;
      }
    });
    // general allergy count
    generalAllergy.forEach((problem) => {
      const generalAllergy = PatientHistory?.allergies.which.general.find(
        (p) => p._id === problem._id.toString()
      );
      if (generalAllergy) {
        problem.count = (problem.count || 0) + 1;
      }
    });
    // drug allergy count
    durgAllergy.forEach((problem) => {
      const durgAllergy = PatientHistory?.allergies.which.drug.find(
        (p) => p._id === problem._id.toString()
      );
      if (durgAllergy) {
        problem.count = (problem.count || 0) + 1;
      }
    });
    // medical problem familyCount
    familyMember.forEach((problem) => {
      const familyMember = PatientHistory?.familyHistory.find(
        (p) => p._id === problem._id.toString()
      );
      if (familyMember) {
        problem.familyCount = (problem.familyCount || 0) + 1;
      }
    });

    // life Style count
    lifeStyle.forEach((problem) => {
      const lifeStyle = PatientHistory?.lifeStyle.find(
        (p) => p._id === problem._id.toString()
      );
      if (lifeStyle) {
        problem.count = (problem.count || 0) + 1;
      }
    });
    // procedure count
    procedure.forEach((problem) => {
      const procedure = PatientHistory?.procedure.which.find(
        (p) => p._id === problem._id.toString()
      );
      if (procedure) {
        problem.count = (problem.count || 0) + 1;
      }
    });

    await Promise.all([
      medicalProblems.map((problem) => problem.save()),
      drugHistory.map((problem) => problem.save()),
      generalAllergy.map((problem) => problem.save()),
      durgAllergy.map((problem) => problem.save()),
      familyMember.map((problem) => problem.save()),
      lifeStyle.map((problem) => problem.save()),
      procedure.map((problem) => problem.save()),
    ]);

    const updatePatientHistory = await PatientHistroyModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatePatientHistory) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Patient History not found" });
    }
    res.status(httpStatus.OK).json({
      msg: "Patient History Updated Successfully",
      data: updatePatientHistory,
    });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getAllPatientHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const patientHistory = await PatientHistroyModel.find({
      patientId: id,
    });
    res
      .status(httpStatus.OK)
      .json({ msg: "Patient details found", data: patientHistory });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
};

const getPatientHistoryByConsultantAndPatient = async (req, res) => {
  const { consultantId, opdPatientId } = req.params;

  try {
    // Attempt to find the patient history
    const patientHistory = await PatientHistroyModel.findOne({
      consultantId: consultantId,
      opdPatientId: opdPatientId,
    });

    // If no history is found, return a 404 response
    if (!patientHistory) {
      return res.status(404).json({
        success: false,
        message: "Patient history not found",
      });
    }

    // If history is found, return it with a 200 response
    return res.status(200).json({
      success: true,
      message: "Patient history found successfully",
      patientHistory: patientHistory,
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error fetching patient history:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching patient history",
      error: error.message,
    });
  }
};

module.exports = {
  createPatientHistory,
  updatePatientHistory,
  getAllPatientHistory,
  getPatientHistoryByConsultantAndPatient,
};
