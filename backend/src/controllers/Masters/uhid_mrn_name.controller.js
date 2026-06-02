const httpStatus = require("http-status");
const { UHID_MRN_Model } = require("../../models");

const createName = async (req, res) => {
  try {
    const newName = new UHID_MRN_Model({ ...req.body });
    const savedName = await newName.save();
    return res.status(httpStatus.CREATED).json({ msg: "Name added successfully", data: savedName });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};


const getAllName = async (req, res) => {
  try {
    const newName = await UHID_MRN_Model.find({ delete: false });
    res.status(httpStatus.OK).json({ data: newName });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const UpadteAllName = async (req, res) => {
  try {
    const { id } = req.params
    const newName = await UHID_MRN_Model.findByIdAndUpdate(
        { _id:id} , 
        {$set:{...req.body}},
        { new:true}
        );
        res.status(httpStatus.OK).json({msg:"Updated Sucessfully", data: newName });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};


module.exports = {
  createName,
  getAllName,
  UpadteAllName
}