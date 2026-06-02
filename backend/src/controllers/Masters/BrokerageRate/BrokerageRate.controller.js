const { default: mongoose } = require("mongoose");
// const {
//   brokerageRateModel,
// } = require("../../../models/Masters/BrokerageRate/BrokerageRate.model");
const { brokerageRateModel } = require("../../../models/index");

const getBrokerageRateController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const brokerageRates = await brokerageRateModel
      .find({
        companyId: new mongoose.Types.ObjectId(companyId),
      })
      .sort({ brokerageRate: 1 }); // 1 = ascending
    if (!brokerageRates || brokerageRates.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No Brokerage Rate found" });
    }
    // sort data from newest to oldest
    // brokerageRates.sort(
    //   (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    // );

    res.status(200).json({ status: "true", data: brokerageRates });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching positions", error.message],
    });
  }
};

const postBrokerageRateController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const brokerageRate = req.body.brokerageRate;
    if (!brokerageRate) {
      return res.status(400).json({
        status: "false",
        message: " Brokerage Rate is required",
      });
    }
    const newbrokerageRate = new brokerageRateModel({
      brokerageRate: Number(brokerageRate),
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    await newbrokerageRate.save();
    res.status(201).json({ status: "true", data: newbrokerageRate });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "false",
      message: ["Error creating  Brokerage Rate", error.message],
    });
  }
};

const putBrokerageRateController = async (req, res) => {
  try {
    const id = req.params.id;
    const { brokerageRate } = req.body;

    const updatedRate = await brokerageRateModel.findByIdAndUpdate(
      id,
      { brokerageRate },
      { new: true, runValidators: true },
    );

    if (!updatedRate) {
      return res
        .status(404)
        .json({ status: "false", message: "Broker Rate not found" });
    }

    res.status(200).json({ status: "true", data: updatedRate });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error Updating Broker Rate", error.message],
    });
  }
};

const deleteBrokerageRateController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedRate = await brokerageRateModel.findByIdAndDelete(id);

    if (!deletedRate) {
      return res
        .status(404)
        .json({ status: "false", message: "Brokerage Rate not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "Brokerage Rate deleted Successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting Brokerage Rate", error.message],
    });
  }
};

module.exports = {
  getBrokerageRateController,
  postBrokerageRateController,
  putBrokerageRateController,
  deleteBrokerageRateController,
};
