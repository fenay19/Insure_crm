const { RefferBy } = require("../../models");
const httpStatus = require("http-status");

const addRefferBy = async (req, res) => {
  try {
    const newRefferBy = new RefferBy(req.body);
    await newRefferBy.save();
    res
      .status(201)
      .json({ message: "RefferBy added successfully", RefferBy: newRefferBy });
  } catch (error) {
    console.log(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in creating a RefferBy", error });
  }
};

const getAllRefferBy = async (req, res) => {
  try {
    const allRefferBy = await RefferBy.find({ delete: false })
    if (!allRefferBy) {
        res.status(httpStatus.NOT_FOUND).json({ msg: "No RefferBy found" })
    }
    res.status(httpStatus.OK).json({ msg: "RefferBy found successfully",  allRefferBy })
} catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Error in fetching all the RefferBy" }, err)
}
};

module.exports = {
  addRefferBy,
  getAllRefferBy,
};
