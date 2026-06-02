const BrandNameModel = require("../../../models/Masters/medicine/brand.model");

const createBrandName = async (req, res) => {
  try {
    const { brandName } = req.body;
    const newBrand = new BrandNameModel({ brandName });
    const saveBrand = await newBrand.save();
    res.status(201).json({ success: true, data: saveBrand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBrandName = async (req, res) => {
  try {
    const { id } = req.params;
    const updateBrand = await BrandNameModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({ success: true, data: updateBrand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBrands = async (req, res) => {
  try {
    const brands = await BrandNameModel.find({ delete: false });
    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBrands = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBrand = await BrandNameModel.findByIdAndUpdate(
      id,
      { delete: true },
      { new: true }
    );
    return res.status(200).json({ success: true, data: deleteBrand });
  } catch (error) {
    res.status(200).json({ success: false, message: error.message });
  }
};

const bulkImport = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: "Invalid or empty data provided" });
    }

    // Insert data into MongoDB
    await BrandNameModel.insertMany(req.body);

    return res
      .status(201)
      .json({ message: "Data imported successfully", data: newData });
  } catch (error) {
    console.error("Error importing data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createBrandName,
  updateBrandName,
  getAllBrands,
  deleteBrands,
  bulkImport,
};
