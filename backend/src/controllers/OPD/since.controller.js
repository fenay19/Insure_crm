const httpStatus = require("http-status");
const SinceMasterModel = require("../../models/OPD/since.model");

const createSince = async (req, res) => {
  try {
    const { since } = req.body;

    if (!since) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "since is required" });
    }

    const newSince = new SinceMasterModel({ since });
    const savedSinceData = await newSince.save();

    res.status(httpStatus.CREATED).json({
      msg: "Since added successfully",
      data: savedSinceData,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getAllSince = async (req, res) => {
  try {
    const sinceList = await SinceMasterModel.find();
    res.status(httpStatus.OK).json({ data: sinceList });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const updateSince = async (req, res) => {
  try {
    const { id } = req.params;
    const { since } = req.body;

    if (!since) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "since is required" });
    }

    const updatedSince = await SinceMasterModel.findByIdAndUpdate(
      id,
      { since },
      { new: true, runValidators: true }
    );

    if (!updatedSince) {
      return res.status(httpStatus.NOT_FOUND).json({ msg: "Since not found" });
    }

    res.status(httpStatus.OK).json({
      msg: "Since updated successfully",
      data: updatedSince,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const deleteSince = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSince = await SinceMasterModel.findByIdAndDelete(id);

    if (!deletedSince) {
      return res.status(httpStatus.NOT_FOUND).json({ msg: "Since not found" });
    }

    res.status(httpStatus.OK).json({ msg: "Since deleted successfully" });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

module.exports = {
  createSince,
  getAllSince,
  updateSince,
  deleteSince,
};
