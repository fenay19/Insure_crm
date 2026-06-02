const { default: mongoose } = require("mongoose");
const { positionModel } = require("../../../models/index");

const getPositionController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const positions = await positionModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    });
    if (!positions || positions.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "No positions found" });
    }
    // sort data from newest to oldest
    positions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ status: "true", data: positions });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error fetching positions", error.message],
    });
  }
};

const postPositionController = async (req, res) => {
  try {
    const { companyId } = req.query;
    const position = req.body.position;
    if (!position) {
      return res
        .status(400)
        .json({ status: "false", message: "position is required" });
    }

    const newPosition = new positionModel({ position, companyId });
    await newPosition.save();
    res.status(201).json({ status: "true", data: newPosition });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error creating position", error.message],
    });
  }
};

const putPositionController = async (req, res) => {
  try {
    const id = req.params.id;
    const { position } = req.body;

    const updatedPosition = await positionModel.findByIdAndUpdate(
      id,
      { position },
      { new: true, runValidators: true }
    );

    if (!updatedPosition) {
      return res
        .status(404)
        .json({ status: "false", message: "Position not found" });
    }

    res.status(200).json({ status: "true", data: updatedPosition });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error Updating position", error.message],
    });
  }
};

const deletePositionController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedPosition = await positionModel.findByIdAndDelete(id);

    if (!deletedPosition) {
      return res
        .status(404)
        .json({ status: "false", message: "position not found" });
    }

    res
      .status(200)
      .json({ status: "true", message: "position deleted Successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: ["Error deleting positions", error.message],
    });
  }
};

module.exports = {
  getPositionController,
  postPositionController,
  putPositionController,
  deletePositionController,
};
