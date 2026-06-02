const { default: mongoose } = require("mongoose");
const { NetworkModel } = require("../../../models/index");

const getNetworkController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const networks = await NetworkModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });

    if (!networks || networks.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No networks found" });
    }
    // sort data newwet to oldwet
    networks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ status: "true", data: networks });
  } catch (err) {
    res.status(500).json({ status: "false", error: err.message });
  }
};

const createNetworkController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const networkName = req.body.networkName;
    const exists = await NetworkModel.findOne({ networkName, companyId });
    if (exists)
      return res
        .status(400)
        .json({ status: "false", message: "Network Name already exists" });

    const newNetwork = new NetworkModel({ networkName, companyId });
    await newNetwork.save();
    res.status(201).json({ status: "true", data: newNetwork });
  } catch (err) {
    res.status(500).json({ status: "false", error: err.message });
  }
};

const updateNetworkController = async (req, res) => {
  try {
    const { id } = req.params;
    const { networkName } = req.body;

    const updated = await NetworkModel.findByIdAndUpdate(
      id,
      { networkName },
      { new: true }
    );
    if (!updated)
      return res
        .status(404)
        .json({ status: "false", message: "Network not found" });

    res.status(200).json({ status: "true", data: updated });
  } catch (err) {
    res.status(500).json({ status: "false", error: err.message });
  }
};

const deleteNetworkController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await NetworkModel.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ status: "false", message: "Network not found" });

    res.status(200).json({ status: "true", message: "Network deleted" });
  } catch (err) {
    res.status(500).json({ status: "false", error: err.message });
  }
};

module.exports = {
  getNetworkController,
  createNetworkController,
  updateNetworkController,
  deleteNetworkController,
};
