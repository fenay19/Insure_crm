const { default: mongoose } = require("mongoose");
const { incotermsModel } = require("../../../models/index");

const getIncotermsController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const incoterms = await incotermsModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!incoterms || incoterms.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No Incoterms found" });
    }
    // sort data from newest to oldest
    incoterms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ status: "true", data: incoterms });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching Incoterms", error.message],
    });
  }
};

const postIncotermsController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const incoterms = req.body.incoterms;
    if (!incoterms) {
      return res
        .status(400)
        .json({ status: "false", message: " Incoterms is required" });
    }
    const newInsDepartment = new incotermsModel({
      incoterms,
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    console.log("before save ", newInsDepartment);
    await newInsDepartment.save();
    res.status(201).json({ status: "true", data: newInsDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating  incoterms", error.message],
    });
  }
};

const putIncotermsController = async (req, res) => {
  try {
    const id = req.params.id;
    const { incoterms } = req.body;

    const updatedDepartment = await incotermsModel.findByIdAndUpdate(
      id,
      { incoterms },
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "Incoterms not found" });
    }

    res.status(200).json({ status: "true", data: updatedDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error Updating Incoterms", error.message],
    });
  }
};

const deleteIncotermsController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedDepartment = await incotermsModel.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "Incoterms not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "Incoterms deleted Successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting Incoterms", error.message],
    });
  }
};

module.exports = {
  getIncotermsController,
  postIncotermsController,
  putIncotermsController,
  deleteIncotermsController,
};
