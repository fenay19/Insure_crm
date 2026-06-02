const { professionModel } = require("../../../models/index");

const getProfessionController = async (req, res) => {
  try {
    const professions = await professionModel.find();
    res.status(200).json({ status: "true", data: professions });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching professions", error.message],
    });
  }
};

const postProfessionController = async (req, res) => {
  try {
    const { profession } = req.body;

    if (!profession) {
      return res.status(400).json({
        status: "false",
        message: "profession field is required",
      });
    }

    const newProfession = new professionModel({ profession });
    await newProfession.save();

    res.status(201).json({ status: "true", data: newProfession });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating profession", error.message],
    });
  }
};

const putProfessionController = async (req, res) => {
  try {
    const id = req.params.id;
    const { profession } = req.body;

    const updatedProfession = await professionModel.findByIdAndUpdate(
      id,
      { profession },
      { new: true, runValidators: true }
    );

    if (!updatedProfession) {
      return res.status(404).json({
        status: "false",
        message: "Profession not found",
      });
    }

    res.status(200).json({ status: "true", data: updatedProfession });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error updating profession", error.message],
    });
  }
};

const deleteProfessionController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedProfession = await professionModel.findByIdAndDelete(id);

    if (!deletedProfession) {
      return res.status(404).json({
        status: "false",
        message: "Profession not found",
      });
    }

    res.status(200).json({
      status: "true",
      message: "Profession deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting profession", error.message],
    });
  }
};

module.exports = {
  getProfessionController,
  postProfessionController,
  putProfessionController,
  deleteProfessionController,
};
