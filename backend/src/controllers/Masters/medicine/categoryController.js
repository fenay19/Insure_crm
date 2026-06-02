const CategoryModel = require("../../../models/Masters/medicine/category.model");

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const newCategory = new CategoryModel({ categoryName });
    const savedCategory = await newCategory.save();
    res.status(201).json({ success: true, data: savedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Categories (excluding deleted ones)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find({ delete: false });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Soft Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { delete: true, deletedAt: new Date() },
      { new: true }
    );
    res.status(200).json({ success: true, data: deletedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkImport = async (req, res) => {
  try {
    const categories = req.body; // Expecting an array of category objects

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ error: "Invalid or empty data provided" });
    }

    const result = await CategoryModel.insertMany(categories);

    res.status(201).json({
      msg: "Categories added successfully!",
      data: result,
    });
  } catch (error) {
    console.error("Error importing categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
