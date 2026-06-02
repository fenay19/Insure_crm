const { default: mongoose } = require("mongoose");
const { PrefixModel } = require("../../../models/index");
const httpStatus = require("http-status");

const addPrefix = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { prefix } = req.body;
    const deletes = false;

    const exsistingPrefix = await PrefixModel.findOne({
      prefix,
      delete: deletes,
    });
    if (exsistingPrefix) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "The Prefix is already exists!!" });
    }
    const newPrefix = new PrefixModel({ prefix, companyId });
    await newPrefix.save();

    res
      .status(201)
      .json({ message: "Prefix added successfully", prefix: newPrefix });
  } catch (error) {
    console.log(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in creating a Prefix", error });
  }
};

const getPrefix = async (req, res) => {
  try {
    const { companyId } = req.query;
    const allPrefix = await PrefixModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
      delete: false,
    });
    if (!allPrefix || allPrefix.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({ msg: "No prefix found" });
    }
    res
      .status(httpStatus.OK)
      .json({ msg: "Prefix found successfully", allPrefix });
  } catch (error) {
    console.error("Error fetching prefix:", error);
    res.status(500).json({ message: "Error fetching prefix", error });
  }
};

const updatePrefix = async (req, res) => {
  try {
    const { id } = req.params;
    const { prefix } = req.body;
    const deletes = false;
    const existingPrefix = await PrefixModel.findOne({
      prefix: prefix,
      delete: deletes,
    });

    if (existingPrefix && existingPrefix._id.toString() !== id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "The Prefix is already exists!!" });
    }

    const newPrefix = await PrefixModel.findByIdAndUpdate(
      { _id: id },
      { $set: { prefix } },
      { new: true }
    );
    res
      .status(httpStatus.OK)
      .json({ message: "Prefix updated successfully", prefix: newPrefix });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in updating the Prefix", error });
  }
};

const deletePrefix = async (req, res) => {
  try {
    const { id } = req.params;
    const prefix = await PrefixModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body, delete: true, deletedAt: Date.now(), new: true }
    );

    if (!prefix) {
      res.status(httpStatus.NOT_FOUND).json({ message: "No prefix found!!" });
    }
    res
      .status(httpStatus.OK)
      .json({ message: "Prefix deleted successfully!!" });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: "Error in deleting prefix!!" });
  }
};

module.exports = {
  addPrefix,
  getPrefix,
  updatePrefix,
  deletePrefix,
};
