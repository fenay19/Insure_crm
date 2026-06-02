const { VitalModel } = require("../../models");
const httpStatus = require("http-status");

const addvitals = async (req, res) => {
  try {
    console.log(req.body);
    const newVitals = new VitalModel(req.body);
    await newVitals.save();
    res
      .status(201)
      .json({ message: "Vitals added successfully", Vitals: newVitals });
  } catch (error) {
    console.log(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in creating a Vitals", error });
  }
};

const getAllVitals = async (req, res) => {
  try {
    const allVitals = await VitalModel.find({ delete: false });
    if (!allVitals) {
      res.status(httpStatus.NOT_FOUND).json({ msg: "No Vitals found" });
    }
    res
      .status(httpStatus.OK)
      .json({ msg: "Vitals found successfully", allVitals });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in fetching all the Vitals" }, err);
  }
};

const updateVitalsById = async (req, res) => {
  try {
      const vitals = await VitalModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.status(httpStatus.OK).json({msg: "Vitals  Updated Successfully", vitals});
  } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({msg: "Vitals Not Found", error});
  }
};

const deleteVitalsByIds = async (req, res) => {
  try {
    const { ids } = req.body; // Assuming IDs are sent in the request body
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({ msg: "Invalid or missing IDs array" });
    }

    // Convert ids to Mongoose ObjectId if needed
    const objectIdArray = ids.map(id => id.toString()); // No 'new' keyword required here

    // Delete the vitals with the provided IDs
    const result = await VitalModel.deleteMany({ _id: { $in: objectIdArray }, delete: false });

    if (result.deletedCount === 0) {
      return res.status(httpStatus.NOT_FOUND).json({ msg: "No Vitals found with the provided IDs" });
    }

    res.status(httpStatus.OK).json({ msg: "Vitals deleted successfully", result });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Error in deleting vitals", details: err.message });
  }
};


module.exports = {
  addvitals,
  getAllVitals,
  deleteVitalsByIds,
  updateVitalsById,
};
