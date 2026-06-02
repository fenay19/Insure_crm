const httpStatus = require("http-status");
const { InvestigationPathologyMasterModel } = require("../../../models");
const { ProfileMasterModel } = require("../../../models");
const mongoose = require("mongoose");

// Function to sanitize ObjectId values
const sanitizeObjectId = (value) => {
  return value && mongoose.Types.ObjectId.isValid(value) ? value : null;
};
const getAllInvestigation = async (req, res) => {
  try {
    const investigations = await InvestigationPathologyMasterModel.find({
      delete: false,
    });

    const latestRecord = await InvestigationPathologyMasterModel.findOne({
      delete: false,
    })
      .sort({ testCode: -1 })
      .select("testCode")
      .lean();

    let nextTestCode;

    if (latestRecord && latestRecord.testCode) {
      const latestCodeNumber = parseInt(latestRecord.testCode, 10);
      nextTestCode = (latestCodeNumber + 1).toString().padStart(4, "0");
    } else {
      nextTestCode = "0001";
    }

    return res.status(200).json({
      msg: "All investigations found successfully",
      investigations: investigations,
      nextTestCode: nextTestCode,
    });
  } catch (error) {
    return res.status(500).json({ err: "Server Error", error });
  }
};

// const addInvestigation = async (req, res) => {

//   try {
//     const investigation = req.body;
//     // if (!investigation) {
//     //   return res.status(400).json({ msg: "Please fill all fields" });
//     // }
//     const newInvestigation = new InvestigationPathologyMasterModel(req.body);
//     await newInvestigation.save();
//     return res
//       .status(httpStatus.CREATED)
//       .json({ msg: "New Test added successfully", newInvestigation });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ err: "Server Error", error });
//   }
// };

const addInvestigation = async (req, res) => {
  try {
    const {
      departmentId,
      machineId,
      unitId,
      specimenId,
      billGroupId,
      ...otherFields
    } = req.body;

    // Sanitize ObjectId fields
    const sanitizedData = {
      ...otherFields,
      departmentId: sanitizeObjectId(departmentId),
      machineId: sanitizeObjectId(machineId),
      unitId: sanitizeObjectId(unitId),
      specimenId: sanitizeObjectId(specimenId),
      billGroupId: sanitizeObjectId(billGroupId),
    };

    const newInvestigation = new InvestigationPathologyMasterModel(
      sanitizedData
    );
    await newInvestigation.save();

    return res.status(httpStatus.CREATED).json({
      msg: "New Test added successfully",
      newInvestigation,
    });
  } catch (error) {
    console.error("Error adding investigation:", error);
    res.status(500).json({ err: "Server Error", error });
  }
};

// const editInvestigation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const investigation =
//       await InvestigationPathologyMasterModel.findByIdAndUpdate(
//         { _id: id },
//         { ...req.body },
//         { new: true }
//       );

//     if (!investigation) {
//       return res.status(400).json({ msg: "Test not found" });
//     }
//     const saved = await investigation.save();
//     return res.status(httpStatus.OK).json({
//       msg: `${saved.testName} test updated successfully`,
//       investigation,
//     });
//   } catch (error) {
//     res.status(500).json({ err: "Server Error", error });
//   }
// };

const editInvestigation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid investigation ID" });
    }

    const {
      departmentId,
      machineId,
      unitId,
      specimenId,
      billGroupId,
      ...otherFields
    } = req.body;

    // Sanitize ObjectId fields
    const sanitizedData = {
      ...otherFields,
      departmentId: departmentId ? sanitizeObjectId(departmentId) : null,
      machineId: machineId ? sanitizeObjectId(machineId) : null,
      unitId: unitId ? sanitizeObjectId(unitId) : null,
      specimenId: specimenId ? sanitizeObjectId(specimenId) : null,
      billGroupId: billGroupId ? sanitizeObjectId(billGroupId) : null,
    };

    // Update investigation
    const investigation =
      await InvestigationPathologyMasterModel.findByIdAndUpdate(
        id,
        sanitizedData,
        { new: true, runValidators: true }
      );

    if (!investigation) {
      return res.status(404).json({ msg: "Test not found" });
    }

    return res.status(httpStatus.OK).json({
      msg: `${investigation.testName} test updated successfully`,
      investigation,
    });
  } catch (error) {
    console.error("Error updating investigation:", error);
    res.status(500).json({ err: "Server Error", error: error.message });
  }
};

const updateInvestigationRateAndCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { rate, newCode, category } = req.body;
    console.log("RAYE", rate, newCode);
    // Check if `rate` or `newCode` is provided
    if (rate === undefined && newCode === undefined) {
      return res.status(400).json({
        msg: "Please provide at least one field to update: 'rate' or 'newCode'.",
      });
    }

    // Prepare the update object dynamically
    const updateData = {};
    if (rate !== undefined) updateData.rate = rate;
    if (newCode !== undefined) updateData.newCode = newCode;
    if (category !== undefined) updateData.category = category;

    // Update the investigation with the specific fields
    const investigation =
      await InvestigationPathologyMasterModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true } // Return the updated document
      );

    if (!investigation) {
      return res.status(404).json({
        msg: "Investigation not found.",
      });
    }

    return res.status(200).json({
      msg: "Investigation updated successfully.",
      investigation,
    });
  } catch (error) {
    console.error("Error updating investigation:", error);
    res.status(500).json({
      err: "Server Error",
      error: error.message,
    });
  }
};

const deleteInvestigation = async (req, res) => {
  try {
    const { id } = req.params;
    const investigation =
      await InvestigationPathologyMasterModel.findByIdAndUpdate(
        { _id: id },
        { delete: true, deletedAt: Date.now() },
        { new: true }
      );
    if (!investigation) {
      return res.status(400).json({ msg: "Test not found" });
    }
    const saved = await investigation.save();
    return res.status(httpStatus.OK).json({
      msg: `${saved.testName} test deleted successfully`,
      investigation: saved,
    });
  } catch (error) {
    res.status(500).json({ err: "Server Error", error });
  }
};

const importTests = async (req, res) => {
  try {
    const testsData = req.body;

    if (!testsData || testsData.length === 0) {
      return res.status(400).json({ msg: "No test data provided" });
    }

    const createdTests = await InvestigationPathologyMasterModel.insertMany(
      testsData
    );

    return res.status(201).json({
      msg: "Tests imported successfully",
      data: createdTests,
    });
  } catch (error) {
    console.error("Error importing tests:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/* below apis are for profile master */

const createProfile = async (req, res) => {
  try {
    const saveData = await new ProfileMasterModel(req.body).save();

    return res.status(201).json({
      STATUS: 201,
      msg: "Profile created successfully",
      data: saveData,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      STATUS: 500,
      msg: "Internal Server Error: Unable to create profile",
      error: error.message || error,
    });
  }
};

const editProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body)
    const {
      profileName,
      billGroupId,
      billGroup,
      departmentId,
      department,
      mainTests,
      sections,
    } = req.body;

    // Basic validation
    if (!profileName || !Array.isArray(mainTests) || !Array.isArray(sections)) {
      return res.status(400).json({
        status: 400,
        msg: "Invalid request. Required fields: profileName, mainTests (array), sections (array).",
      });
    }

    // Validate testIds in mainTests
    const areMainTestIdsValid = mainTests.every((test) =>
      mongoose.Types.ObjectId.isValid(test.testId)
    );

    // Validate testIds in sections
    const areSectionTestIdsValid = sections.every(
      (sec) =>
        Array.isArray(sec.tests) &&
        sec.tests.every((test) => mongoose.Types.ObjectId.isValid(test.testId))
    );

    if (!areMainTestIdsValid || !areSectionTestIdsValid) {
      return res.status(400).json({
        status: 400,
        msg: "Invalid testId(s) found in mainTests or sections.",
      });
    }

    // Update the profile
    const updatedProfile = await ProfileMasterModel.findByIdAndUpdate(
      id,
      {
        profileName,
        billGroupId,
        billGroup,
        departmentId,
        department,
        mainTests,
        sections,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        status: 404,
        msg: "Profile not found.",
      });
    }

    return res.status(200).json({
      status: 200,
      msg: "Profile updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      status: 500,
      msg: "An error occurred while updating the profile.",
      error: error.message,
    });
  }
};

const getAllProfile = async (req, res) => {
  try {
    const profiles = await ProfileMasterModel.find({ delete: false })
      .populate({
        path: "mainTests.testId",
        select: "testName testCode machineName formula unit testDetail",
      })
      .populate({
        path: "sections.tests.testId",
        select: "testName testCode machineName formula unit testDetail",
      })
      .exec();

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({
        STATUS: 404,
        msg: "No profiles found",
      });
    }

    return res.status(200).json({
      STATUS: 200,
      msg: "All profiles retrieved successfully",
      data: profiles,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return res.status(500).json({
      STATUS: 500,
      msg: "Server error: Unable to retrieve profiles",
    });
  }
};

const getSingleProfileById = (req, res) => {
  return res.status(200).json({ STATUS: 200, msg: "single data found" });
};

const deleteProfileById = async (req, res) => {
  const { id: profileId } = req.params;

  try {
    const profile = await ProfileMasterModel.findByIdAndUpdate(
      profileId,
      { delete: true },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ status: 404, msg: "Profile not found" });
    }

    return res.status(200).json({
      status: 200,
      msg: "Profile successfully deleted",
      data: profile,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      msg: "An error occurred while deleting the profile",
      error: error.message,
    });
  }
};

// third layer investigation
const addThirdInvestigation = async (req, res) => {
  try {
    const { id, paramId } = req.params;
    const investigation =
      await InvestigationPathologyMasterModel.findOneAndUpdate(
        { _id: id, "parameters._id": paramId },
        { $push: { "parameters.$.thirdparameters": { ...req.body } } },
        { new: true }
      );

    if (!investigation) {
      return res
        .status(400)
        .json({ msg: "Investigation or Parameter not found" });
    }

    return res
      .status(httpStatus.OK)
      .json({ msg: "Parameter updated successfully", investigation });
  } catch (error) {
    res.status(500).json({ err: "Server Error", error });
  }
};

const editThirdInvestigation = async (req, res) => {
  try {
    const { id, paramId, thirdParamId } = req.params;
    const { ...updatedThirdParams } = req.body;

    const investigation =
      await InvestigationPathologyMasterModel.findOneAndUpdate(
        { _id: id, "parameters.thirdparameters._id": thirdParamId },
        {
          $set: {
            "parameters.$[outer].thirdparameters.$[inner]": {
              _id: thirdParamId,
              ...updatedThirdParams,
            },
          },
        },
        {
          new: true,
          arrayFilters: [
            { "outer._id": paramId },
            { "inner._id": thirdParamId },
          ],
        }
      );

    if (!investigation) {
      return res
        .status(400)
        .json({ msg: "Investigation or Parameter not found" });
    }

    return res
      .status(httpStatus.OK)
      .json({ msg: "Third Parameter updated successfully", investigation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "Server Error", error });
  }
};

const deleteThirdInvestigation = async (req, res) => {
  try {
    const { id, paramId, thirdParamId } = req.params;

    const investigation =
      await InvestigationPathologyMasterModel.findOneAndUpdate(
        { _id: id, "parameters._id": paramId },
        {
          $pull: {
            "parameters.$[outer].thirdparameters": { _id: thirdParamId },
          },
        },
        {
          new: true,
          arrayFilters: [{ "outer._id": paramId }],
        }
      );

    if (!investigation) {
      return res
        .status(400)
        .json({ msg: "Investigation or Parameter not found" });
    }

    return res
      .status(httpStatus.OK)
      .json({ msg: "Third Parameter deleted successfully", investigation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "Server Error", error });
  }
};

module.exports = {
  addInvestigation,
  getAllInvestigation,
  editInvestigation,
  deleteInvestigation,
  importTests,

  createProfile,
  editProfileById,
  getAllProfile,
  getSingleProfileById,
  deleteProfileById,
  addThirdInvestigation,
  editThirdInvestigation,
  deleteThirdInvestigation,
  updateInvestigationRateAndCode,
};
