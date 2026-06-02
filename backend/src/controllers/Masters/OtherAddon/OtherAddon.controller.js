const { default: mongoose } = require("mongoose");
const { otherAddonModel } = require("../../../models/index");

const getOtherAddonController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const otherAddons = await otherAddonModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!otherAddons || otherAddons.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No other Addon found" });
    }
    // sort data from newest to oldest
    otherAddons.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ status: "true", data: otherAddons });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching other Addon", error.message],
    });
  }
};

const postOtherAddonController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const otherAddon = req.body.otherAddon;
    if (!otherAddon) {
      return res
        .status(400)
        .json({ status: "false", message: "other Addon is required" });
    }
    const newInsDepartment = new otherAddonModel({
      otherAddon,
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    await newInsDepartment.save();
    res.status(201).json({ status: "true", data: newInsDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating  other Addon", error.message],
    });
  }
};

const putOtherAddonController = async (req, res) => {
  try {
    const id = req.params.id;
    const { otherAddon } = req.body;

    const updatedDepartment = await otherAddonModel.findByIdAndUpdate(
      id,
      { otherAddon },
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "other Addon not found" });
    }

    res.status(200).json({ status: "true", data: updatedDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error Updating other Addon", error.message],
    });
  }
};

const deleteOtherAddonController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedDepartment = await otherAddonModel.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "other Addon not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "other Addon deleted Successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting other Addon", error.message],
    });
  }
};

module.exports = {
  getOtherAddonController,
  postOtherAddonController,
  putOtherAddonController,
  deleteOtherAddonController,
};
