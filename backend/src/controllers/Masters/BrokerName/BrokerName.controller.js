const { default: mongoose } = require("mongoose");
const { brokerNameModel } = require("../../../models/index");

const getBrokerNameController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const brokerNames = await brokerNameModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!brokerNames || brokerNames.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No Broker Name found" });
    }
    // sort data from newest to oldest
    brokerNames.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ status: "true", data: brokerNames });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching Broker Name", error.message],
    });
  }
};

const postBrokerNameController = async (req, res) => {
  try {
    console.log("reched post ", req.body);
    const { companyId } = req.query;
    const brokerName = req.body.brokerName;
    if (!brokerName) {
      return res
        .status(400)
        .json({ status: "false", message: " Broker Name is required" });
    }
    const newInsDepartment = new brokerNameModel({
      brokerName,
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    console.log("before save ", newInsDepartment);
    await newInsDepartment.save();
    res.status(201).json({ status: "true", data: newInsDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating  Broker Name", error.message],
    });
  }
};

const putBrokerNameController = async (req, res) => {
  try {
    const id = req.params.id;
    const { brokerName } = req.body;

    const updatedDepartment = await brokerNameModel.findByIdAndUpdate(
      id,
      { brokerName },
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "Broker Name not found" });
    }

    res.status(200).json({ status: "true", data: updatedDepartment });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error Updating Broker Name", error.message],
    });
  }
};

const deleteBrokerNameController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedDepartment = await brokerNameModel.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res
        .status(404)
        .json({ status: "false", message: "Broker Name not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "Broker Name deleted Successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting vehicle Type", error.message],
    });
  }
};

module.exports = {
  getBrokerNameController,
  postBrokerNameController,
  putBrokerNameController,
  deleteBrokerNameController,
};
